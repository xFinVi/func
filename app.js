const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const multer

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generateThumbnail = async (req, res) => {
  try {
    const { input } = req.body;

    // Ensure input is a string and handle any necessary validations
    if (typeof input !== 'string') {
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
    }

    // Add protocol if missing (assuming HTTPS)
    const imageUrl = input.startsWith('http') ? input : `https://${input}`;

    console.log('Fetching image from:', imageUrl);

    // Fetch the image data using Axios
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    // Resize and convert image to base64 encoded PNG
    const thumbnailBuffer = await sharp(Buffer.from(response.data))
      .resize({ width: 100, height: 100 })
      .toFormat('png')
      .toBuffer();

    // Convert buffer to base64 string
    const base64Image = thumbnailBuffer.toString('base64');

    // Send the base64 encoded image as response
    res.send(base64Image);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
};

const generateThumbnailDocs = (req, res) => {
  res.json({
    name: "generateThumbnail",
    description: "Generate a thumbnail from an image URL",
    input: {
      type: "string",
      description: "URL of the image to generate thumbnail from"
    },
    output: {
      type: "string",
      description: "Base64-encoded thumbnail image"
    }
  });
};

app.post('/generateThumbnail', express.json(), generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
