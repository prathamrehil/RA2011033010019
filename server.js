const express=require("express");
const axios = require('axios');
const app = express();
const port = 8008;

// Endpoint for the "/numbers" API
app.get('/numbers', async (req, res) => {
  try {
    const urls = req.query.url;
    if (!urls) {
      return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    const urlArray = Array.isArray(urls) ? urls : [urls];
    const requests = urlArray.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
      } catch (error) {
        // Ignore errors (timeout or other errors) from the remote URLs
        return [];
      }
    });

    const results = await Promise.all(requests);
    const mergedNumbers = [...new Set(results.flat())].sort((a, b) => a - b);

    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
