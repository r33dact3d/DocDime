const axios = require('axios');

module.exports = async function handler(req, res) {
  const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
  let url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd"
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
};