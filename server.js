import 'dotenv/config';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
console.log("COINGECKO_API_KEY:", COINGECKO_API_KEY);

import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.get('/api/bsv-price', async (_, res) => {
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.get('*', (_, res) => {
});

// Serve React frontend
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});