const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const multer = require('multer');
const upload = multer(); // For parsing multipart/form-data

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

const fetchAndProcessImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer' // Ensure the response is treated as binary data
    });

    // Process the image using sharp
    const thumbnailBuffer = await sharp(Buffer.from(response.data))
      .resize({ width: 100, height: 100 })
      .toFormat('png')
      .toBuffer();

    return thumbnailBuffer;
  } catch (error) {
    console.error('Error fetching or processing image:', error);
    throw error;
  }
};

const generateThumbnail = async (req, res) => {
  try {
    const input = req.body.input; // Assuming 'input' is the field name in the form-data

    console.log('Received input:', input);

    // Ensure input is a string and handle any necessary validations
    if (typeof input !== 'string') {
      console.log('Invalid input format. Expected string URL.');
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
    }

    // Call fetchAndProcessImage and send the processed image buffer as response
    const thumbnailBuffer = await fetchAndProcessImage(input);

   res.type('image/png').send(thumbnailBuffer);
 
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
      example: "https://plus.unsplash.com/premium_photo-1717529138029-5b049119cfb1?q=80&w=1994&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.png"
    },
    output: {
      type: "string",
      description: "Resized image in PNG format as a buffer"
    }
  });
};

app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
