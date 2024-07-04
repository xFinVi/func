const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();

app.use(express.json());

app.post('/generateThumbnail', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Fetch the image from the provided URL
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    // Resize the image to 100x100 pixels (adjust dimensions as needed)
    const thumbnailBuffer = await sharp(Buffer.from(imageResponse.data))
      .resize({ width: 100, height: 100 })
      .toBuffer();

    // Convert the resized image buffer to base64
    const base64Thumbnail = thumbnailBuffer.toString('base64');

    // Respond with the base64-encoded thumbnail
    res.json({ thumbnail: base64Thumbnail });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
});

app.get('/generateThumbnailDocs', (req, res) => {
  const docs = {
    "name": "generateThumbnail",
    "description": "Generate a thumbnail from an image URL",
    "input": {
      "type": "object",
      "properties": {
        "imageUrl": {
          "type": "string",
          "description": "URL of the image to generate thumbnail from"
        }
      },
      "required": ["imageUrl"]
    },
    "output": {
      "type": "object",
      "properties": {
        "thumbnail": {
          "type": "string",
          "description": "Base64-encoded thumbnail image"
        }
      }
    }
  };

  res.json(docs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
