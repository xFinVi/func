const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const docs = {
  "name": "reverseString",
  "description": "Reverse any given string",
  "input": {
    "type": "string",
    "description": "Input the string you'd like to reverse",
    "example": "Hello, world"
  },
  "output": {
    "type": "string",
    "description": "Reversed string",
    "example": "dlrow ,olleH"
  }
};

app.use(bodyParser.json());

app.post('/reverseString', (req, res) => {
  const { input } = req.body;
  if (typeof input !== 'string') {
    return res.status(400).json({ error: 'Input must be a string' });
  }
  const output = input.split('').reverse().join('');
  res.json({ output });
});

app.get('/reverseString', (req, res) => {
  res.json(docs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
