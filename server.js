require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Parse JSON bodies
app.use(express.json());

// Backend API endpoint for BSV price
app.get('/api/bsv-price', async (req, res) => {
  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd&x_cg_demo_api_key=${COINGECKO_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("CoinGecko API error:", err.response ? err.response.data : err.message);
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