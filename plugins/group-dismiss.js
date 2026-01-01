const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, {
    from, quoted, q, isGroup, sender, botNumber, reply
}) => {
    try {
        // 1. گروپ اور ایڈمن چیکس
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // بوٹ اور سینڈر کا ایڈمن سٹیٹس چیک کرنے کے لیے میٹا ڈیٹا حاصل کریں (LID سپورٹ کے لیے)
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        const botId = conn.user?.id;
        const botLid = conn.user?.lid;

        const senderInGroup = participants.find(p => p.id === sender || (p.lid && p.lid === sender));
        const botInGroup = participants.find(p => p.id === botId || (botLid && p.lid === botLid));

        if (!(senderInGroup?.admin)) return reply("❌ Only group admins can use this command.");
        if (!(botInGroup?.admin)) return reply("❌ I need to be an admin to use this command.");

        // 2. ٹارگٹ یوزر کی شناخت (LID یا PN)
        let targetJid;
        if (m.quoted) {
            targetJid = m.quoted.sender; // ریپلائی کی صورت میں مکمل JID (بشمول LID) مل جاتی ہے
        } else if (q && q.includes("@")) {
            // اگر ٹیگ کیا گیا ہو تو منشن لسٹ سے JID نکالیں
            targetJid = mek.mentionedJid[0];
        } else if (q && !isNaN(q)) {
            // اگر صرف نمبر لکھا ہو
            targetJid = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        }

        if (!targetJid) return reply("❌ Please reply to an admin's message or tag them to demote.");

        // بوٹ خود کو ڈیموٹ نہ کرے
        if (targetJid === botId || targetJid === botLid) return reply("❌ The bot cannot demote itself.");

        // 3. چیک کریں کہ کیا وہ واقعی ایڈمن ہے
        const targetInGroup = participants.find(p => p.id === targetJid || (p.lid && p.lid === targetJid));
        if (!targetInGroup?.admin) {
            return reply("ℹ️ This user is already a normal member or not an admin.");
        }

        // 4. ڈیموٹ کریں
        await conn.groupParticipantsUpdate(from, [targetJid], "demote");
        
        // نمبر دکھانے کے لیے کلین فارمیٹ
        const cleanNumber = targetJid.split('@')[0];
        reply(`✅ Successfully demoted @${cleanNumber} to a normal member.`, { mentions: [targetJid] });

    } catch (error) {
        console.error("Demote command error:", error);
        reply("❌ Failed to demote the member. Error: " + error.message);
    }
});
