const axios = require("axios");
const yts = require("yt-search");
const config = require("../config"); 
const { cmd } = require("../command");

cmd({
  pattern: "video",
  alias: ["ytmp4", "ytv"],
  desc: "Downloads YouTube video by title (sends thumbnail first).",
  category: "download",
  react: "🎬",
  filename: __filename 
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide a video title or name to search.");
    }

    // 1. Search video on YouTube
    const search = await yts(q);
    const video = search?.videos?.[0];

    if (!video) {
      return reply("❌ No video results found for that query.");
    }

    const { url, title, image } = video;

    // 2. --- Send the YouTube Thumbnail Image first ---
    if (image) {
        await conn.sendMessage(from, {
            image: { url: image },
            caption: `🔍 *Title:* ${title}\n🌐 *Source:* YouTube\n\n_Fetching video file, please wait..._`,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });
    } else {
        await reply(`⏳ Found video: *${title}*. Fetching download link...`);
    }

    let res;
    let downloadData;
    let videoUrl;
    
    // 3. Call the external 'ytdl' API for video download link
    try {
        const apiUrl = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
        res = await axios.get(apiUrl);
        
        // --- FIX APPLIED HERE: Extracting the nested result object ---
        downloadData = res.data.result;
        videoUrl = downloadData?.mp4; // We need the specific 'mp4' field
        
    } catch (apiError) {
        console.error("Axios API Call Failed:", apiError.message);
        return reply(`❌ The external download service failed to connect. Status: ${apiError.response?.status || 'Connection Error'}. Please try again later.`);
    }

    // 4. Check API response structure and validity of URL
    if (!res.data.status || !videoUrl || typeof videoUrl !== 'string' || videoUrl.length < 10) {
      console.error("Video API response structure error:", res.data);
      // The API gave a response, but the 'mp4' link was missing or invalid.
      return reply("❌ The download service failed to generate a valid video link for this video.");
    }

    // 5. --- Attempt to Send the Video file ---
    try {
        await conn.sendMessage(from, {
          video: { url: videoUrl }, // Send the video file
          mimetype: "video/mp4", 
          caption: `✅ *${downloadData.title || title}* Downloaded Successfully!\n\n_Powered by FATIMA-MD._`,
          contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });

        // The extra success reply line has been removed to prevent duplicate messages.
        
    } catch (mediaError) {
        console.error("Video Send Failed:", mediaError.message);
        return reply("⚠️ Video link found, but failed to send the video. The file might be too large or the link may have expired.");
    }

  } catch (e) {
    console.error("video3 General command error:", e.name, e.message);
    reply("❌ A command processing error occurred during search or setup. Try a different query.");
  }
});
            
