const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to generate a thumbnail from an image URL
const generateThumbnail = async (req, res) => {
  try {
    const { input: imageUrl } = req.body;

    // Fetch the image from the provided URL
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Resize the image to 100x100 pixels (adjust dimensions as needed)
    const thumbnailBuffer = await sharp(Buffer.from(imageResponse.data))
      .resize({ width: 100, height: 100 })
      .toBuffer();

    // Convert the resized image buffer to base64
    const base64Thumbnail = thumbnailBuffer.toString('base64');

    // Respond with the base64-encoded thumbnail
    res.send({ output: base64Thumbnail });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).send({ error: 'Failed to generate thumbnail' });
  }
};

// Define the documentation for generateThumbnail function
const generateThumbnailDocs = (req, res) => {
  const docs = {
    "name": "generateThumbnail",
    "description": "Generate a thumbnail from an image URL",
    "input": {
      "type": "string",
      "description": "URL of the image to generate thumbnail from",
      "example": "https://example.com/image.jpg"
    },
    "output": {
      "type": "string",
      "description": "Base64-encoded thumbnail image",
      "example": "iVBORw0KGgoAAAANSUhEUgAA...",
    }
  };
  res.json(docs);
};

// Define routes
app.post('/generateThumbnail', generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
