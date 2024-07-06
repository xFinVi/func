import express from 'express';
import sharp from 'sharp';
import axios from 'axios';
import multer from 'multer';

const app = express();
const upload = multer();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const fetchAndEncodeImageBase64 = async (imageUrl) => {
  try {
    // Fetch the image from the provided URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch image from ${imageUrl}. Status code: ${response.status}`);
    }

    // Convert image buffer to base64
    const imageBuffer = Buffer.from(response.data, 'binary');
    const base64Image = imageBuffer.toString('base64');

    return base64Image;
  } catch (error) {
    throw new Error(`Failed to fetch and encode image: ${error.message}`);
  }
};

export const generateThumbnail = async (req, res) => {
  const { input } = req.body; // Assuming input is the URL of the image

  try {
    // Validate the input URL
    if (!input || typeof input !== 'string') {
      return res.status(400).send({ error: 'Input URL is required and must be a string.' });
    }

    // Call fetchAndEncodeImageBase64 to get the base64-encoded image
    const base64Image = await fetchAndEncodeImageBase64(input);

    // Send the base64-encoded image as JSON response
    res.json({ output: base64Image });

  } catch (error) {
    console.error('Error generating base64 from image:', error);
    res.status(500).json({ error: 'Failed to generate base64 from image' });
  }
};

const getDocs = (req, res) => {
  res.json({
    name: "generateThumbnail",
    description: "Convert an image URL to a base64-encoded string.",
    input: {
      type: "string",
      description: "URL of the image to convert to base64",
      example: {
  "https://plus.unsplash.com/premium_photo-1717529138029-5b049119cfb1?q=80&w=1994&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}"
    },
    output: {
      type: "string",
      description: "Base64-encoded string representing the image",
      example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSExMWFhUXGBgVFxgYGBgXGBgYFxcXFhUXFxcYHiggGBolHRcXITEiJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGy0lICYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH...etc."
    }
  });
};

app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', getDocs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
