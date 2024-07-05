const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const docs = {
  "name": "generateThumbnail",
  "description": "Generate a thumbnail from an image URL",
  "input": {
    "type": "string",
    "description": "URL of the image to generate thumbnail from"
  },
  "output": {
    "type": "string",
    "description": "Base64-encoded thumbnail image"
  }
};

const generateThumbnail = async (req, res) => {
  try {
    const { input: imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).send({ error: 'Image URL is required' });
    }

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    if (!imageResponse || !imageResponse.data) {
      return res.status(500).send({ error: 'Failed to fetch image data' });
    }

    const thumbnailBuffer = await sharp(Buffer.from(imageResponse.data))
      .resize({ width: 100, height: 100 })
      .toBuffer();

    const base64Thumbnail = thumbnailBuffer.toString('base64');

    res.send({ thumbnail: base64Thumbnail });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).send({ error: 'Failed to generate thumbnail' });
  }
};

const generateThumbnailDocs = (req, res) => {
  res.json(docs);
};

app.post('/generateThumbnail', generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
