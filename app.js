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
    const { input } = req.body;

    // Fetch the image from the provided URL
    const imageResponse = await axios.get(input, { responseType: 'arraybuffer' });

    // Resize the image to 100x100 pixels (adjust dimensions as needed)
    const resizedImageBuffer = await sharp(Buffer.from(imageResponse.data))
      .resize({ width: 100, height: 100 })
      .toBuffer();

    // Set Content-Type header to indicate image/jpeg
    res.set('Content-Type', 'image/jpeg');

    // Send the resized image buffer in the response
    res.send(resizedImageBuffer);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
};

// Define the documentation for generateThumbnail function
const generateThumbnailDocs = (req, res) => {
  const docs = {
    name: "generateThumbnail",
    description: "Generate a thumbnail from an image URL",
    input: {
      type: "string",
      description: "URL of the image to generate a thumbnail from",
      example: { input: "https://images.unsplash.com/photo-1716847214612-e2c2f3771d41?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  }
    },
    output: {
      type: "image/jpeg",
      description: "Resized image in 100x100 thumbnail format"
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
