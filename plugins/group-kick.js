const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, reply, sender, isBotAdmins
}) => {
    try {
        // 1. گروپ چیک
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // 2. اونر چیک (LID اور PN دونوں کے لیے محفوظ طریقہ)
        const botId = conn.user?.id;
        const botLid = conn.user?.lid;
        const botOwnerPN = botId.split(':')[0].split('@')[0];
        
        // اونر کی شناخت: یا تو وہ JID سے میچ کرے یا اس کے فون نمبر سے
        const isOwner = (sender === botId || sender === botLid || sender.includes(botOwnerPN));
        
        if (!isOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        // 3. بوٹ ایڈمن چیک (LID سپورٹ کے ساتھ مینوئل تصدیق)
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        const botInGroup = participants.find(p => p.id === botId || (botLid && p.lid === botLid));

        if (!botInGroup?.admin) {
            return reply("❌ I need to be an admin to use this command.");
        }

        // 4. ٹارگٹ یوزر کی شناخت (LID/JID)
        let targetJid;
        if (m.quoted) {
            targetJid = m.quoted.sender; // ریپلائی میں اصل JID (LID یا PN) مل جاتی ہے
        } else if (q && q.includes("@")) {
            targetJid = mek.mentionedJid[0]; // ٹیگ کی صورت میں
        } else if (q && !isNaN(q)) {
            targetJid = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net"; // صرف نمبر کی صورت میں
        }

        if (!targetJid) return reply("❌ Please reply to a message or mention a user to remove.");

        // بوٹ خود کو یا اونر کو کک نہ کرے
        if (targetJid === botId || targetJid === botLid) {
            return reply("❌ I cannot remove myself.");
        }

        // 5. چیک کریں کہ کیا ٹارگٹ ایڈمن ہے (Safety Check)
        const targetInGroup = participants.find(p => p.id === targetJid || (p.lid && p.lid === targetJid));
        if (targetInGroup?.admin) {
            return reply("❌ I cannot remove an admin. Please demote them first.");
        }

        // 6. کک (Remove) کریں
        await conn.groupParticipantsUpdate(from, [targetJid], "remove");
        
        const cleanNumber = targetJid.split('@')[0];
        reply(`✅ Successfully removed @${cleanNumber}`, { mentions: [targetJid] });

    } catch (error) {
        console.error("Remove command error:", error);
        reply("❌ Failed to remove the member. Error: " + error.message);
    }
});
