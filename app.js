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
    const input = req.body.input; // Assuming 'input' is the field name in the form-data

    console.log('Received input:', input);

    // Ensure input is a string and handle any necessary validations
    if (typeof input !== 'string') {
      console.log('Invalid input format. Expected string URL.');
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
    }

    // Add protocol if missing (assuming HTTPS)
    const imageUrl = input.startsWith('http') ? input : `https://${input}`;

    console.log('Fetching image from:', imageUrl);

    // Fetch the image data using Axios
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    console.log('Image fetched successfully.');

    // Resize and convert image to buffer
    const thumbnailBuffer = await sharp(Buffer.from(response.data))
      .resize({ width: 100, height: 100 })
      .toFormat('png')
      .toBuffer();

    console.log('Image resized and converted to buffer.');

    // Send the image buffer as response
    res.type('image/png').send(thumbnailBuffer);

    console.log('Response sent.');

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
      
    }
  });
};


app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
