require('dotenv').config();
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
console.log("COINGECKO_API_KEY:", COINGECKO_API_KEY);

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Backend API endpoint for BSV price
app.get('/api/bsv-price', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd&x_cg_demo_api_key=${COINGECKO_API_KEY}`,
    );
    console.log("CoinGecko API response:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("CoinGecko API error:", err);
    res.status(500).json({ error: 'Failed to fetch BSV price' });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});