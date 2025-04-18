require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// BSV Price API endpoint
app.get('/api/bsv-price', async (req, res) => {
  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
  let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd";
  
  if (COINGECKO_API_KEY) {
    url += `&x_cg_demo_api_key=${COINGECKO_API_KEY}`;
  }
  
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("CoinGecko API error:", err.response ? err.response.data : err.message);
    res.status(500).json({
      error: 'Failed to fetch BSV price',
      details: err.response ? err.response.data : err.message,
    });
  }
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});