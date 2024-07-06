import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

const fetchAndEncodeImageBase64 = async (imageUrl) => {
  try {
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

export const generateThumbnailBase64 = async (req, res) => {
  try {
    const { input } = req.body;

    console.log('Received image URL:', input);

    // Ensure imageUrl is provided and handle any necessary validations
    if (!input || typeof input !== 'string') {
      console.log('Invalid input format. Expected string URL.');
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
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

export const generateThumbnailDocs = (req, res) => {
  res.json({
    name: "generateThumbnailBase64", 
    description: "Generate a base64-encoded string from an image URL.",
    input: {
      type: "string",
      description: "URL of the image to generate base64 from",
      example: "https://example.com/image.jpg"
    },
    output: {      
          type: "string",
          description: "Base64-encoded image data",
          example: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA...<base64_data>..."
        }         
  });
};

app.post('/generateThumbnail', generateThumbnailBase64);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
