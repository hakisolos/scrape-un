const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const stream = require("stream");

const app = express();
const port = 3000; // You can change the port if needed

// Middleware to allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Function to fetch images based on query
async function getRandomImage(query) {
  const url = `https://unsplash.com/s/photos/${query}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  };

  try {
    const { data: html } = await axios.get(url, { headers });
    const $ = cheerio.load(html);
    
    // Array to hold image URLs
    const imagesData = [];

    $("img").each((i, image) => {
      let imgUrl = $(image).attr("src");

      // Filter out profile images and ensure the URL starts with "https://images.unsplash.com/"
      if (imgUrl && imgUrl.startsWith("https://images.unsplash.com/") && !imgUrl.includes("profile")) {
        // Modify the URL to get a higher quality image
        const sizeParams = "w=1920&h=1080&fit=crop"; // Specify width and height for a larger image
        imgUrl = imgUrl.split('?')[0] + `?${sizeParams}&q=80&ixid=MnwzNjI1fDB8MHxwaG90by1mYW1pbHk&ixlib=rb-1.2.1`;

        // Push to the imagesData array
        imagesData.push(imgUrl);
      }
    });

    // Return a random image URL from the array
    if (imagesData.length > 0) {
      const randomImage = imagesData[Math.floor(Math.random() * imagesData.length)];
      return randomImage;
    } else {
      throw new Error("No images found for this query.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

// API endpoint to get a random image based on query
app.get("/api/wallpaper", async (req, res) => {
  const query = req.query.query || "wallpaper"; // Default to "wallpaper" if no query is provided

  try {
    const imageUrl = await getRandomImage(query);
    
    // Fetch the image and pipe the response to the client
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    
    // Set the correct content type for image
    res.setHeader('Content-Type', 'image/jpeg');
    
    // Pipe the image stream to the response
    imageResponse.data.pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
