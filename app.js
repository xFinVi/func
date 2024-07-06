const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Function to reverse a string
const reverseString = (str) => {
  return str.split('').reverse().join('');
};

// Handler function for POST /functions/reverseString
const reverseStringHandler = (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input. Please provide a string.' });
  }

  const reversed = reverseString(input);
  res.json({ output: reversed });
};

// Handler function for GET /functions/reverseString (for documentation)
const reverseStringDocsHandler = (req, res) => {
  const docs = {
    name: 'reverseString',
    description: 'Reverses a given string',
    input: {
      type: 'string',
      description: 'The string you want to reverse',
      example: 'hello'
    },
    output: {
      type: 'string',
      description: 'The reversed string',
      example: 'olleh'
    }
  };
  res.json(docs);
};

// Routes
app.post('/reverseString', reverseStringHandler);
app.get('/reverseString', reverseStringDocsHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
