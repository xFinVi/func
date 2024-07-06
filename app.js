import express from 'express';
<<<<<<< HEAD
import sharp from 'sharp';
=======
>>>>>>> 2417e5c4b963c92fbf889996f7708fc8580f17bc
import axios from 'axios';
import multer from 'multer';

const app = express();
const upload = multer();

<<<<<<< HEAD
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

export const generateThumbnail = async (req, res) => {
  const { input } = req.body; // Assuming input is the URL of the image

  try {
    // Validate the input URL
    if (!input) {
      return res.status(400).send({ error: 'Input URL is required.' });
    }

    // Fetch the image from the provided URL
    const response = await axios({
      url: input,
      responseType: 'arraybuffer'
    });

    // Resize the image to 100x100 pixels using sharp
    const resizedImage = await sharp(response.data)
      .resize(100, 100)
      .toBuffer();

    // Set the content type to image/jpeg or image/png based on the image type
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);

    // Send the resized image buffer as the response
    res.send(resizedImage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while processing the image.' });
  }
};

const getDocs = (req, res) => {
  res.json({
    name: "generateThumbnail",
    description: "Resize an image to 100x100 pixels and return it.",
    input: {
      type: "string",
      description: "URL of the image to be resized",
      example: "https://example.com/image.jpg"
    },
    output: {
      type: "object",
      description: "Resized image binary data",
      properties: {
        contentType: {
          type: "string",
          description: "MIME type of the resized image",
          example: "image/jpeg"
        },
        data: {
          type: "string",
          description: "Binary data of the resized image",
          example: "<binary image data>"
        }
      }
=======
const upload = multer(); // For parsing multipart/form-data

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

export const generateThumbnail = async (req, res) => {
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
    res.json({ output: JSON.stringify(base64Image) });

  } catch (error) {
    console.error('Error generating base64 from image:', error);
    res.status(500).json({ error: 'Failed to generate base64 from image' });
  }
};

export const generateThumbnailDocs = (req, res) => {
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
>>>>>>> 2417e5c4b963c92fbf889996f7708fc8580f17bc
    }
 });
};

app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', getDocs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
