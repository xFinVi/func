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
    description: "Generate a thumbnail from  an imagUrl return it.",
    input: {
      type: "string",
      description: "URL of the image ",
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
        }       
      }
    }
  });
};

app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', getDocs);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
