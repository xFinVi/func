const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const multer = require('multer');
const upload = multer(); // For parsing multipart/form-data

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

const generateThumbnail = async (req, res) => {
  try {
    let requestBody = req.body;

    // Check if req.body needs to be stringified (for debugging purposes)
    if (typeof requestBody !== 'string' && !(requestBody instanceof Buffer)) {
      // For form-data or other cases where req.body might not be a plain object or string
      requestBody = JSON.stringify(requestBody);
    }

    console.log('Req body:', requestBody);

    // Ensure we handle different content types properly
    const input = typeof req.body === 'string' ? req.body : req.body.input;

    if (typeof input !== 'string') {
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
    }

    const { data } = await axios.get(input, { responseType: 'arraybuffer' });

    const thumbnail = await sharp(Buffer.from(data))
      .resize({ width: 100, height: 100 })
      .toBuffer();

    res.type('jpeg').send(thumbnail);
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
      description: "URL of the image to generate a thumbnail from",
      example: "https://images.unsplash.com/photo-1716847214612-e2c2f3771d41?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    output: {
      type: "string",
      description: "URL of the resized image in 100x100 thumbnail format",
      example: "https://images.unsplash.com/photo-1716847214612-e2c2f3771d41?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  });
};


app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
