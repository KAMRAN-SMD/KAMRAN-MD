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
        
        // بوٹ اور سینڈر کی مختلف ممکنہ آئی ڈیز
        const botLid = conn.user?.lid || '';
        const senderLid = sender; // ہو سکتا ہے کہ یہ پہلے سے ہی LID ہو

        let isSenderAdmin = false;
        let isBotAdmin = false;

        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                // سینڈر چیک (فون نمبر یا LID دونوں صورتوں میں)
                if (p.id === sender || p.lid === sender || (p.phoneNumber && sender.includes(p.phoneNumber.split('@')[0]))) {
                    isSenderAdmin = true;
                }
                // بوٹ چیک (فون نمبر یا LID دونوں صورتوں में)
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
    pattern: "mute",
    alias: ["groupmute"],
    react: "🔇",
    desc: "Mute the group (Only admins can send messages).",
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
        if (!isBotAdmin) return reply("❌ I need to be an admin to mute the group.");

        await conn.groupSettingUpdate(from, "announcement");
        reply("✅ Group has been muted. Only admins can send messages.");
    } catch (e) {
        console.error("Error muting group:", e);
        reply("❌ Failed to mute the group. Please try again.");
    }
});
