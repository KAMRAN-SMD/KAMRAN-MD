const { cmd, commands } = require('../command');
const config = require('../config');

// Function to check if user is admin (with LID support)
async function isUserAdmin(conn, chatId, userId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        // Normalize IDs for comparison
        const normalizeId = (id) => {
            if (!id) return '';
            // Remove all common suffixes
            return id
                .replace(/:[0-9]+/g, '') // Remove session suffix like :4
                .replace(/@(lid|s\.whatsapp\.net|c\.us|g\.us)/g, '') // Remove domain suffixes
                .replace(/[^\d]/g, ''); // Keep only numbers
        };
        
        const normalizedUserId = normalizeId(userId);
        
        // Check if user is admin
        for (let p of participants) {
            // Try different ID fields
            const participantIds = [
                p.id,
                p.lid,
                p.phoneNumber,
                p.jid
            ].filter(Boolean);
            
            for (let pid of participantIds) {
                if (normalizeId(pid) === normalizedUserId) {
                    return p.admin === "admin" || p.admin === "superadmin";
                }
            }
        }
        
        return false;
    } catch (err) {
        console.error('Error checking admin status:', err);
        return false;
    }
}

// Function to check if bot is admin (with LID support)
async function isBotAdmin(conn, chatId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        // Get bot's IDs
        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';
        
        // Normalize bot IDs
        const normalizeId = (id) => {
            if (!id) return '';
            return id
                .replace(/:[0-9]+/g, '')
                .replace(/@(lid|s\.whatsapp\.net|c\.us|g\.us)/g, '')
                .replace(/[^\d]/g, '');
        };
        
        const normalizedBotId = normalizeId(botId);
        const normalizedBotLid = normalizeId(botLid);
        
        // Check if bot is admin
        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                // Check different ID fields of participant
                const participantIds = [
                    p.id,
                    p.lid,
                    p.phoneNumber
                ].filter(Boolean);
                
                for (let pid of participantIds) {
                    const normalizedPid = normalizeId(pid);
                    if (normalizedPid === normalizedBotId || normalizedPid === normalizedBotLid) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    } catch (err) {
        console.error('Error checking bot admin status:', err);
        return false;
    }
}

cmd({
    'on': "body"
}, async (conn, m, store, {
    from,
    body,
    sender,
    isGroup,
    reply
}) => {
    try {
        // Check if anti-link is enabled
        if (config.ANTI_LINK === 'false' || !config.ANTI_LINK || config.ANTI_LINK === false) {
            return;
        }

        // Only act in groups
        if (!isGroup) {
            return;
        }

        // Check if sender is admin (with LID support)
        const senderIsAdmin = await isUserAdmin(conn, from, sender);
        if (senderIsAdmin) {
            return; // Admins are allowed to send links
        }

        // Check if bot is admin (with LID support)
        const botIsAdmin = await isBotAdmin(conn, from);
        if (!botIsAdmin) {
            return; // Bot needs to be admin to take action
        }

        // Clean the message body for URL detection
        let cleanBody = body.replace(/[\s\u200b-\u200d\uFEFF]/g, '').toLowerCase();
        
        // URL detection regex (including WhatsApp links)
        const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.(?:com|org|net|co|pk|biz|id|info|xyz|online|site|website|tech|shop|store|blog|app|dev|io|ai|gov|edu|mil|me)(?:\/[^\s]*)?|whatsapp\.com\/channel\/|wa\.me\//gi;
        
        // Check if message contains any forbidden links
        const containsLink = urlRegex.test(cleanBody);

        if (containsLink) {
            console.log(`⚠️ Link detected from ${sender} in ${from}: ${body.substring(0, 50)}...`);

            // Extract user mention name
            const userNumber = sender.split('@')[0] || 'User';
            
            // MODE: "true" - Kick immediately
            if (config.ANTI_LINK === 'true' || config.ANTI_LINK === true) {
                try {
                    // First try to delete the message
                    try {
                        await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
                        console.log(`🗑️ Message deleted: ${m.key.id}`);
                    } catch (deleteError) {
                        console.error("Failed to delete message:", deleteError);
                    }

                    // Send kick notification
                    await conn.sendMessage(from, {
                        'text': `🚫 *ANTI-LINK PROTECTION*\n\n` +
                               `@${userNumber} has been removed from the group for sending links.\n` +
                               `Links are strictly prohibited in this group.`,
                        'mentions': [sender]
                    });

                    // Kick the user
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    console.log(`👢 User kicked: ${userNumber}`);
                    
                } catch (kickError) {
                    console.error("Failed to kick user:", kickError);
                    // Try to at least send a warning
                    await conn.sendMessage(from, {
                        'text': `⚠️ @${userNumber} sent a link but I couldn't remove them. Please remove manually.`,
                        'mentions': [sender]
                    });
                }
            }
        }
    } catch (error) {
        console.error("Anti-link system error:", error);
        // Don't send error messages to avoid spam
    }
});
