const { cmd } = require("../command");

/**
 * Integrated Admin Status Check (LID & PN Support)
 * This function ensures the bot correctly identifies LID even in new WhatsApp updates.
 */
async function checkAdminStatus(conn, chatId, senderId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';
        
        const botNumber = botId.includes(':') ? botId.split(':')[0] : (botId.includes('@') ? botId.split('@')[0] : botId);
        const botIdWithoutSuffix = botId.includes('@') ? botId.split('@')[0] : botId;
        const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);
        const botLidWithoutSuffix = botLid.includes('@') ? botLid.split('@')[0] : botLid;
        
        const senderNumber = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
        const senderIdWithoutSuffix = senderId.includes('@') ? senderId.split('@')[0] : senderId;
        
        let isBotAdmin = false;
        let isSenderAdmin = false;
        
        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const pPhoneNumber = p.phoneNumber ? p.phoneNumber.split('@')[0] : '';
                const pId = p.id ? p.id.split('@')[0] : '';
                const pLid = p.lid ? p.lid.split('@')[0] : '';
                const pFullId = p.id || '';
                const pFullLid = p.lid || '';
                const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : pLid;
                
                const botMatches = (
                    botId === pFullId ||
                    botId === pFullLid ||
                    botLid === pFullLid ||
                    botLidNumeric === pLidNumeric ||
                    botLidWithoutSuffix === pLid ||
                    botNumber === pPhoneNumber ||
                    botNumber === pId ||
                    botIdWithoutSuffix === pPhoneNumber ||
                    botIdWithoutSuffix === pId ||
                    (botLid && botLid.split('@')[0].split(':')[0] === pLid)
                );
                
                if (botMatches) isBotAdmin = true;
                
                const senderMatches = (
                    senderId === pFullId ||
                    senderId === pFullLid ||
                    senderNumber === pPhoneNumber ||
                    senderNumber === pId ||
                    senderIdWithoutSuffix === pPhoneNumber ||
                    senderIdWithoutSuffix === pId ||
                    (pLid && senderIdWithoutSuffix === pLid)
                );
                
                if (senderMatches) isSenderAdmin = true;
            }
        }
        return { isBotAdmin, isSenderAdmin };
    } catch (err) {
        console.error('❌ Error checking admin status:', err);
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

// --- Common Newsletter Context ---
const newsletterContext = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363402493709861@newsletter',
        newsletterName: 'NAWAZ-MD',
        serverMessageId: 143
    }
};

// ==================== KICK COMMAND ====================
cmd({
  pattern: "kick",
  alias: ["remove", "k"],
  desc: "Remove a user from the group",
  category: "group",
  react: "💀",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, mentionedJid, botNumber }) => {
  try {
    if (!isGroup) return reply("❌ Yeh command sirf groups mein kaam karta hai.");
    
    const senderId = mek.key.participant || mek.key.remoteJid || (mek.key.fromMe ? conn.user?.id : null);
    const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, senderId);
    
    if (!isSenderAdmin) return reply("❌ Sirf group admins hi yeh command use kar sakte hain.");
    if (!isBotAdmin) return reply("❌ Mujhe admin banayein taaki main kisi ko nikaal sakun.");

    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!users) return reply("❓ Please reply ya mention karein us user ko jise nikaalna hai.");

    if (users.includes(botNumber)) return reply("🤖 Main khud ko kick nahi kar sakta!");

    await conn.groupParticipantsUpdate(from, [users], "remove");
    await conn.sendMessage(from, { 
        text: `*✅ User successfully removed from group.*`,
        mentions: [users],
        contextInfo: newsletterContext
    }, { quoted: mek });

  } catch (err) {
    reply("❌ User ko nikaalne mein galti hui.");
  }
});

// ==================== PROMOTE COMMAND ====================
cmd({
  pattern: "promote",
  alias: ["p", "makeadmin"],
  desc: "Promote a user to admin",
  category: "group",
  react: "👑",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, mentionedJid, botNumber }) => {
  try {
    if (!isGroup) return reply("❌ Yeh command sirf groups mein kaam karta hai.");
    
    const senderId = mek.key.participant || mek.key.remoteJid || (mek.key.fromMe ? conn.user?.id : null);
    const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, senderId);
    
    if (!isSenderAdmin) return reply("❌ Sirf group admins hi promote kar sakte hain.");
    if (!isBotAdmin) return reply("❌ Mujhe admin banayein pehle.");

    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!users) return reply("❓ Kise admin banana hai? Mention karein.");

    await conn.groupParticipantsUpdate(from, [users], "promote");
    await conn.sendMessage(from, { 
        text: `*✅ User promoted to Admin successfully.*`,
        mentions: [users],
        contextInfo: newsletterContext
    }, { quoted: mek });

  } catch (err) {
    reply("❌ Promotion failed.");
  }
});

// ==================== DEMOTE COMMAND ====================
cmd({
  pattern: "demote",
  alias: ["d", "removeadmin"],
  desc: "Demote a group admin",
  category: "group",
  react: "📉",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, mentionedJid, botNumber }) => {
  try {
    if (!isGroup) return reply("❌ Yeh command sirf groups mein kaam karta hai.");
    
    const senderId = mek.key.participant || mek.key.remoteJid || (mek.key.fromMe ? conn.user?.id : null);
    const { isBotAdmin, isSenderAdmin } = await checkAdminStatus(conn, from, senderId);
    
    if (!isSenderAdmin) return reply("❌ Sirf group admins hi demote kar sakte hain.");
    if (!isBotAdmin) return reply("❌ Main admin nahi hun.");

    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!users) return reply("❓ Kise demote karna hai? Mention karein.");

    await conn.groupParticipantsUpdate(from, [users], "demote");
    await conn.sendMessage(from, { 
        text: `*✅ Admin demoted to normal member.*`,
        mentions: [users],
        contextInfo: newsletterContext
    }, { quoted: mek });

  } catch (err) {
    reply("❌ Demotion failed.");
  }
});
