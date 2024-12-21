/*const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

async function getLyrics(query) {
  const searchUrl = `https://genius.com/search?q=${encodeURIComponent(query)}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  };

  try {
    const { data: searchHtml } = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(searchHtml);

    const songLink = $("a.mini_card").first().attr("href");
    if (!songLink) throw new Error("Song not found.");

    const { data: lyricsHtml } = await axios.get(songLink, { headers });
    const $$ = cheerio.load(lyricsHtml);

    const lyrics = $$(".Lyrics__Container-sc-1ynbvzw-6").text().trim();
    if (!lyrics) throw new Error("Lyrics not found.");

    return { lyrics, songLink };
  } catch (error) {
    throw new Error(error.message);
  }
}

app.get("/api/lyrics", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Please provide a query parameter." });
  }

  try {
    const { lyrics, songLink } = await getLyrics(query);
    res.json({ lyrics, songLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/
