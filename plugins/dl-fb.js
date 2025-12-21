const axios = require("axios");
const { cmd } = require("../command");

// --- API Endpoints ---
const PRIMARY_API_URL = "https://apisnodz.com.br/api/downloads/facebook/dl"; // User's requested API
const FALLBACK_API_URL = "https://aemt.me/fbdown?url="; // Reliable public fallback API

// Function to fetch video data from either API
async function fetchVideo(url) {
    let downloadUrl = null;
    let videoTitle = "Facebook Video";
    let quality = '';

    // --- Attempt 1: Primary API (apisnodz.com.br) ---
    try {
        console.log("Attempt 1: Trying Primary API...");
        const response = await axios.get(PRIMARY_API_URL, { 
            params: { url: url },
            timeout: 15000 
        });
        const data = response.data;
        
        // Assuming this API returns a direct array of links [data[0].url]
        if (data && data.length > 0 && data[0].url) {
            downloadUrl = data[0].url;
            quality = 'Primary (Standard)';
            // Title is usually not provided by this endpoint, so we use generic
            return { downloadUrl, videoTitle, quality };
        }
    } catch (e) {
        console.warn(`Primary API failed: ${e.message}`);
    }

    // --- Attempt 2: Fallback API (aemt.me/fbdown) ---
    try {
        console.log("Attempt 2: Trying Fallback API...");
        const apiUrl = `${FALLBACK_API_URL}${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl, { timeout: 15000 });
        const data = response.data;

        // Assuming fallback API structure has a simple direct download link field
        if (data && data.status && data.url) { 
            downloadUrl = data.url;
            quality = 'Fallback (Standard)';
            videoTitle = data.title || videoTitle; 
            return { downloadUrl, videoTitle, quality };
        }
    } catch (e) {
        console.error(`Fallback API failed: ${e.message}`);
    }

    return null; // Both failed
}

cmd({
    pattern: "facedl",
    alias: ["fb", "facebookdl"],
    desc: "Facebook URL se video download karta hai (Dual API Fallback).", // Downloads video from Facebook URL (Dual API Fallback).
    category: "download",
    react: "📘",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix, command }) => {
    try {
        if (!q) {
            return reply(`❌ Kripya Facebook video ka link dein.\n\n*Udaharan:* ${prefix + command} [Facebook Link]`); // Please provide a Facebook video link.
        }

        // Check for valid Facebook URL format
        if (!q.includes("facebook.com") && !q.includes("fb.watch")) {
            // Original code had a wrong check here (checking for facebook.com and throwing error for instagram)
            return reply("❌ Kripya sahi Facebook URL dein."); // Please provide a valid Facebook URL.
        }

        await reply("⏳ Facebook video download link khoja jaa raha hai, kripya intezaar karein..."); // Searching for download link, please wait...

        // Fetch video data using the dual-API logic
        const videoData = await fetchVideo(q);

        if (!videoData || !videoData.downloadUrl) {
            return reply("❌ Video download link prapt nahi hua. Ho sakta hai link private ho ya dono APIs kaam na kar rahi hon."); // Failed to get download link.
        }

        // Send the video file
        await conn.sendMessage(from, {
            video: { url: videoData.downloadUrl },
            mimetype: "video/mp4",
            caption: `✅ *${videoData.videoTitle}* Downloaded Successfully!\n*Quality:* ${videoData.quality}\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ DR KAMRAN*`
        }, { quoted: mek });

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ facedl command error (General):", e.message);
        reply("⚠️ Video download karte samay ek anapekshit truti hui. Kripya link check karein."); 
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
      
