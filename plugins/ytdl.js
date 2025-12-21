const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

// NOTE: This code uses two endpoints: /download/ytdl (for base data/video) and /download/audio (for audio link, as requested by user).

const cache = new Map(); // Caching search results

// --- Helper Functions ---

function normalizeYouTubeUrl(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
  return match ? `https://youtube.com/watch?v=${match[1]}` : null;
}

function getVideoId(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Function to fetch base data (title, thumbnail, and internal ytdl links)
async function fetchBaseData(url, retries = 2) {
  const cacheKey = `baseData:${getVideoId(url)}`;
  if (cache.has(cacheKey)) {
    console.log(`Using cached data for: ${url}`);
    return cache.get(cacheKey);
  }

  try {
    const apiUrl = `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(url)}`;
    console.log(`Fetching Base Data from API: ${apiUrl}`);
    
    const response = await axios.get(apiUrl, { timeout: 15000 });
    const data = response.data;

    if (data.status === true && data.result) {
      const downloadData = data.result;
      
      const result = {
        download_url_mp4: downloadData.mp4, // Video link from /ytdl
        download_url_mp3: downloadData.mp3, // Audio link from /ytdl (fallback)
        title: downloadData.title || "",
        thumbnail: data.info?.image || `https://i.ytimg.com/vi/${getVideoId(url)}/hqdefault.jpg`,
      };
      
      cache.set(cacheKey, result);
      setTimeout(() => cache.delete(cacheKey), 3600000); // Cache for 1 hour
      return result;
    }
    
    throw new Error("API status failure or result missing.");
  } catch (error) {
    console.error(`Base Data fetch failed: ${error.message}`);
    if (retries > 0) {
      console.log(`Retrying API fetch... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return fetchBaseData(url, retries - 1);
    }
    return null;
  }
}

async function searchYouTube(query, maxResults = 1) {
  const cacheKey = `search:${query}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const searchResults = await yts({ query, pages: 1 });
    const videos = searchResults.videos.slice(0, maxResults);
    cache.set(cacheKey, videos);
    setTimeout(() => cache.delete(cacheKey), 1800000); 
    return videos;
  } catch (error) {
    console.error(`Search error: ${error.message}`);
    return [];
  }
}

// --- MAIN COMMAND ---
cmd(
  {
    pattern: "play",
    alias: ["yta", "dlsong", "ytmp4"],
    react: "🎬",
    desc: "Download video/audio from YouTube with simple selection (1=MP4, 2=MP3).",
    category: "ice Pakistan",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("Kripya video ka naam ya URL dein aur phir menu se select karein."); 

      await robin.sendMessage(from, { react: { text: "🔍", key: mek.key } });

      const url = normalizeYouTubeUrl(q);
      let ytdata;

      if (url) {
        const searchResults = await searchYouTube(url);
        if (!searchResults.length) return reply("❌ Video not found!");
        ytdata = searchResults[0];
      } else {
        const searchResults = await searchYouTube(q);
        if (!searchResults.length) return reply("❌ No videos found matching your query!");
        ytdata = searchResults[0];
      }

      // Format the descriptive text for the simplified menu
      let desc = `
 🎬 KAMRAN MD DOWNLOADER 🎬

📌 *Title:* ${ytdata.title}
🎬 *Channel:* ${ytdata.author.name}
👁️ *Views:* ${ytdata.views}
⏱️ *Duration:* ${ytdata.timestamp}
🕒 *Uploaded:* ${ytdata.ago}
🔗 *Link:* ${ytdata.url}

🔢 *Reply with a number to select format:*
1 - MP4 (Video) 🎥
2 - MP3 (Audio) 🎶
   
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴍʀᴀɴ ᴍᴅ`; 

      // Send the menu message
      const vv = await robin.sendMessage(
        from,
        { image: { url: ytdata.thumbnail }, caption: desc },
        { quoted: mek }
      );

      await robin.sendMessage(from, { react: { text: "✅", key: mek.key } });

      // --- LISTEN FOR USER'S REPLY ---
      robin.ev.on("messages.upsert", async (msgUpdate) => {
        const msg = msgUpdate.messages[0];
        
        // Ensure the message is a reply to the menu we just sent
        if (
          !msg.message || 
          !msg.message.extendedTextMessage || 
          msg.message.extendedTextMessage.contextInfo.stanzaId !== vv.key.id
        ) return;

        const selectedOption = msg.message.extendedTextMessage.text.trim();
        
        try {
            
          const validOptions = ["1", "2"]; // Only 1 or 2 are valid
          if (!validOptions.includes(selectedOption)) {
            await robin.sendMessage(from, { react: { text: "❓", key: msg.key } });
            return reply("Kripya sahi option (1 ya 2) se reply karein."); 
          }

          await robin.sendMessage(from, { react: { text: "⏳", key: msg.key } });

          // Determine media type based on selection
          const isAudio = selectedOption === "2";

          // Fetch the download URLs using the base data function
          const data = await fetchBaseData(ytdata.url);
          
          let downloadUrl;
          let formatText;

          if (isAudio) {
              formatText = "MP3 Audio";
              // --- Audio Logic: Use the user's requested /download/audio endpoint ---
              const audioApiUrl = `https://jawad-tech.vercel.app/download/audio?url=${encodeURIComponent(ytdata.url)}`;
              
              try {
                  const audioRes = await axios.get(audioApiUrl, { timeout: 15000 });
                  if (audioRes.data.status === true && audioRes.data.result) {
                      downloadUrl = audioRes.data.result;
                  } else {
                      throw new Error("Dedicated Audio API failed to return a direct link.");
                  }
              } catch (audioApiError) {
                  console.error("Dedicated Audio API Failed. Falling back to /ytdl link:", audioApiError.message);
                  // Fallback: If dedicated API fails, use the link fetched by /ytdl
                  downloadUrl = data?.download_url_mp3; 
              }
          } else {
              formatText = "MP4 Video";
              // Video link always comes from the /ytdl fetch done in fetchBaseData
              downloadUrl = data?.download_url_mp4;
          }

          if (!data || !downloadUrl) {
            await robin.sendMessage(from, { react: { text: "❌", key: msg.key } });
            return reply("❌ Download link nahi mil paaya! Kripya dobara koshish karein."); 
          }

          const fileExtension = isAudio ? 'mp3' : 'mp4';
          const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
          const mediaKey = isAudio ? 'audio' : 'video';
          
          // Send the final media
          await robin.sendMessage(
            from,
            {
              [mediaKey]: { url: downloadUrl },
              mimetype: mimeType,
              // --- CRITICAL FIX: Explicitly setting ptt: false for audio to prevent corruption error ---
              ptt: isAudio ? false : undefined, 
              fileName: `${ytdata.title}_${formatText}.${fileExtension}`,
              caption: `✅ *${ytdata.title}* Downloaded Successfully!\n*Format:* ${formatText}`,
            },
            { quoted: msg }
          );
          
          // Final success reaction
          await robin.sendMessage(from, { react: { text: "✅", key: msg.key } });

        } catch (error) {
          console.error("Download error:", error);
          await robin.sendMessage(from, { react: { text: "❌", key: msg.key } });
          reply(`⚠️ Download karte samay truti aayi: ${error.message}`);
        }
      });
    } catch (e) {
      console.error("Command error:", e);
      await robin.sendMessage(from, { react: { text: "❌", key: mek.key } });
      reply(`⚠️ *Error:* ${e.message || "Anjaan truti hui"}`);
    }
  }
);
    
