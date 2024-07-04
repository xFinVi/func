const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const docs = {
  "name": "capitalizeString",
  "description": "Capitalize all letters in a given string",
  "input": {
    "type": "string",
    "description": "Input the string you'd like to capitalize",
    "example": "hello, world"
  },
  "output": {
    "type": "string",
    "description": "String with all letters capitalized",
    "example": "HELLO, WORLD"
  }
};

app.use(bodyParser.json());

app.post('/capitalizeString', (req, res) => {
  const { input } = req.body;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string' });
  }
  
  const output = input.toUpperCase(); // Capitalize all letters
  res.json({ output });
});

app.get('/capitalizeString', (req, res) => {
  res.json(docs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
