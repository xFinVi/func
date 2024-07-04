const express = require('express');
const axios = require('axios');

const app = express();

const docs = {
  "name": "generateJoke",
  "description": "Generate a random joke",
  "input": {
    "type": "none",
    "description": "No input required",
  },
  "output": {
    "type": "object",
    "description": "A random joke",
    "example": {
      "setup": "Why don't scientists trust atoms?",
      "punchline": "Because they make up everything!"
    }
  }
};

app.use(express.json());

app.get('/generateJoke', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    const joke = response.data;
    res.json({ joke });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

app.get('/generateJokeDocs', (req, res) => {
  res.json(docs);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
