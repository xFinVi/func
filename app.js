import express from 'express';
import sharp from 'sharp';
import multer from 'multer';
import https from 'https';

const upload = multer(); // For parsing multipart/form-data
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

const fetchAndProcessImage = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, { responseType: 'arraybuffer' }, async (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image. Status code: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        const buffer = Buffer.concat(chunks);

        try {
          const thumbnailBuffer = await sharp(buffer)
            .resize({ width: 100, height: 100 })
            .toFormat('png')
            .toBuffer();

          resolve(thumbnailBuffer);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

export const generateThumbnail = async (req, res) => {
  try {
    const input = req.body.input; // Assuming 'input' is the field name in the form-data

    console.log('Received input:', input);

    // Ensure input is a string and handle any necessary validations
    if (typeof input !== 'string') {
      console.log('Invalid input format. Expected string URL.');
      return res.status(400).json({ error: 'Invalid input format. Expected string URL.' });
    }

    // Call fetchAndProcessImage and send the processed image buffer as response
    const output = await fetchAndProcessImage(input);

    // Set the appropriate headers for a PNG image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', output.length);

    // Send the image data directly as the response
    res.send(output);

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
};

export const generateThumbnailDocs = (req, res) => {
  res.json({
    name: "generateThumbnail",
    description: "Generate a thumbnail from an image URL (string).",
    input: {
      type: "string",
      description: "URL of the image to generate a thumbnail from",
      example: "https://example.com/image.jpg"
    },
    output: {
      type: "image/png",
      description: "Resized image in PNG format as binary data",
      example: "<Binary image data>" // Example of binary image data, actual content can vary
    }
  });
};

app.post('/generateThumbnail', upload.none(), generateThumbnail);
app.get('/generateThumbnail', generateThumbnailDocs);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
