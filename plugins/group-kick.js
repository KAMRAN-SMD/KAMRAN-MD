const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Removes a member from the group (LID Fixed)",
    category: "admin",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, sender, isBotAdmins, mentionedJid
}) => {
    try {
        // 1. گروپ چیک
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // 2. ایڈمن چیک (LID سپورٹ کے ساتھ)
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        const botId = conn.user?.id;
        const botLid = conn.user?.lid;

        // چیک کریں کہ کیا کمانڈ دینے والا ایڈمن ہے
        const senderInGroup = participants.find(p => p.id === sender || (p.lid && p.lid === sender));
        if (!senderInGroup?.admin) {
            return reply("❌ Only group admins can use this command.");
        }

        // چیک کریں کہ کیا بوٹ ایڈمن ہے
        const botInGroup = participants.find(p => p.id === botId || (botLid && p.lid === botLid));
        if (!botInGroup?.admin) {
            return reply("❌ I need to be an admin to kick members.");
        }

        // 3. ٹارگٹ یوزر (جسے نکالنا ہے) کی شناخت
        let targetJid;
        if (m.quoted) {
            // ریپلائی کے ذریعے (سب سے محفوظ طریقہ جو LID پر بھی کام کرتا ہے)
            targetJid = m.quoted.sender;
        } else if (mentionedJid && mentionedJid.length > 0) {
            // ٹیگ (Tag) کے ذریعے
            targetJid = mentionedJid[0];
        } else if (q && !isNaN(q.replace(/[^0-9]/g, ''))) {
            // نمبر ٹائپ کرنے کی صورت میں
            targetJid = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        }

        if (!targetJid) {
            return reply("❌ Please reply to a member's message or tag them to kick.");
        }

        // 4. سیفٹی چیکس (Safety Checks)
        if (targetJid === botId || targetJid === botLid) {
            return reply("❌ I cannot remove myself.");
        }

        const targetInGroup = participants.find(p => p.id === targetJid || (p.lid && p.lid === targetJid));
        
        if (!targetInGroup) {
            return reply("❌ User is not in this group.");
        }

        // اگر ٹارگٹ ایڈمن ہے تو اسے کک نہ کریں
        if (targetInGroup.admin) {
            return reply("❌ I cannot kick an admin. Please demote them first.");
        }

        // 5. کک (Kick) کرنے کا عمل
        // ہم [targetJid] کی لسٹ بھیجتے ہیں کیونکہ واٹس ایپ ملٹیپل ریموول سپورٹ کرتا ہے
        await conn.groupParticipantsUpdate(from, [targetJid], "remove");
        
        const cleanNumber = targetJid.split('@')[0];
        return reply(`✅ Successfully removed @${cleanNumber}`, { mentions: [targetJid] });

    } catch (error) {
        console.error("Kick command error:", error);
        return reply("❌ Failed to remove the member. Error: " + error.message);
    }
});
