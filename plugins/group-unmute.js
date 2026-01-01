const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

/**
 * LID-Safe Admin Checker
 * واٹس ایپ کے نئے آئی ڈی سسٹم (LID) اور فون نمبر دونوں کو چیک کرتا ہے
 */
async function checkLidAdmins(conn, from, sender, botId) {
    try {
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        
        const botLid = conn.user?.lid || '';
        let isSenderAdmin = false;
        let isBotAdmin = false;

        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                // سینڈر کی آئی ڈی یا LID چیک کریں
                if (p.id === sender || p.lid === sender || (p.phoneNumber && sender.includes(p.phoneNumber.split('@')[0]))) {
                    isSenderAdmin = true;
                }
                // بوٹ کی آئی ڈی یا LID چیک کریں
                if (p.id === botId || p.lid === botLid || (p.phoneNumber && botId.includes(p.phoneNumber.split('@')[0]))) {
                    isBotAdmin = true;
                }
            }
        }
        return { isSenderAdmin, isBotAdmin };
    } catch (e) {
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

cmd({
    pattern: "unmute",
    alias: ["groupunmute", "open"],
    react: "🔊",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // LID فکس کے ساتھ ایڈمن اسٹیٹس چیک کریں
        const botId = conn.user?.id;
        const { isSenderAdmin, isBotAdmin } = await checkLidAdmins(conn, from, sender, botId);

        if (!isSenderAdmin) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmin) return reply("❌ I need to be an admin to unmute the group.");

        // گروپ کو سب کے لیے کھولنے کی سیٹنگ
        await conn.groupSettingUpdate(from, "not_announcement");
        reply("✅ Group has been unmuted. Everyone can send messages.");
        
    } catch (e) {
        console.error("Error unmuting group:", e);
        reply("❌ Failed to unmute the group. Please try again.");
    }
});
