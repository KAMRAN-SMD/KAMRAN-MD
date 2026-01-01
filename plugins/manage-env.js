//---------------------------------------------------------------------------
//           KAMRAN-MD (LID FIXED VERSION)
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THE CORE LOGIC ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const path = require('path');

/**
 * Helper to check Admin Status with LID support
 */
async function checkAdmins(conn, from, sender) {
    try {
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants || [];
        const botId = conn.user?.id;
        const botLid = conn.user?.lid;

        const isSenderAdmin = participants.some(p => (p.id === sender || (p.lid && p.lid === sender)) && (p.admin === 'admin' || p.admin === 'superadmin'));
        const isBotAdmin = participants.some(p => (p.id === botId || (botLid && p.lid === botLid)) && (p.admin === 'admin' || p.admin === 'superadmin'));

        return { isSenderAdmin, isBotAdmin };
    } catch (e) {
        return { isSenderAdmin: false, isBotAdmin: false };
    }
}

// --- OWNER SETTINGS ---

cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*");
    const status = args[0]?.toLowerCase();
    if (status === "on") { config.ADMIN_EVENTS = "true"; return reply("✅ Admin events enabled."); }
    if (status === "off") { config.ADMIN_EVENTS = "false"; return reply("❌ Admin events disabled."); }
    reply(`Usage: .admin-events on/off`);
});

cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");
    if (!args[0]) return reply(`📌 Current mode: *${config.MODE}*\n\nUsage: .mode private/public`);
    const modeArg = args[0].toLowerCase();
    if (["private", "public"].includes(modeArg)) {
        config.MODE = modeArg;
        return reply(`✅ Bot mode set to *${modeArg.toUpperCase()}*.`);
    }
    reply("❌ Invalid mode.");
});

// --- GROUP SETTINGS (LID FIXED) ---

cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, args, sender, reply }) => {
  try {
    if (!isGroup) return reply('This command can only be used in a group.');
    
    // LID Fixed Admin Check
    const { isSenderAdmin, isBotAdmin } = await checkAdmins(conn, from, sender);
    
    if (!isBotAdmin) return reply('❌ I need to be an admin to manage links.');
    if (!isSenderAdmin) return reply('❌ Only admins can use this command.');

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      reply("✅ ANTI_LINK has been enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      reply("❌ ANTI_LINK has been disabled.");
    } else {
      reply("Usage: *.antilink on/off*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});

cmd({
  pattern: "antilinkkick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, args, sender, reply }) => {
  try {
    if (!isGroup) return reply('This command can only be used in a group.');
    
    const { isSenderAdmin, isBotAdmin } = await checkAdmins(conn, from, sender);
    if (!isBotAdmin) return reply('❌ I need to be an admin.');
    if (!isSenderAdmin) return reply('❌ Admin only.');

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      reply("✅ ANTI_LINK_KICK has been enabled.");
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      reply("❌ ANTI_LINK_KICK has been disabled.");
    } else {
      reply("Usage: *.antilinkkick on/off*");
    }
  } catch (e) {
    reply(`Error: ${e.message}`);
  }
});

// --- OTHER AUTO SETTINGS ---

cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*");
    if (args[0] === "on") { config.AUTO_STATUS_SEEN = "true"; return reply("✅ Auto-status view enabled."); }
    if (args[0] === "off") { config.AUTO_STATUS_SEEN = "false"; return reply("❌ Auto-status view disabled."); }
    reply(`Usage: .auto-seen on/off`);
}); 

cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    desc: "enable or disable auto-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*");
    if (args[0] === "on") { config.AUTO_REPLY = "true"; return reply("✅ Auto-reply enabled."); }
    if (args[0] === "off") { config.AUTO_REPLY = "false"; return reply("❌ Auto-reply disabled."); }
    reply(`Usage: .auto-reply on/off`);
});

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this command!*");
    const newPrefix = args[0];
    if (!newPrefix) return reply("❌ Provide a prefix. Example: .setprefix !");
    config.PREFIX = newPrefix;
    return reply(`✅ Prefix changed to *${newPrefix}*`);
});
