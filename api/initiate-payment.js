const axios = require('axios');

module.exports = async (req, res) => {
  try {
    console.log('Starting initiate-payment function');

    // Log request details
    console.log('Request:', { method: req.method, body: req.body });

    // Log environment variables presence
    console.log('App ID:', process.env.HANDCASH_APP_ID ? 'Set' : 'Missing');
    console.log('App Secret:', process.env.HANDCASH_APP_SECRET ? 'Set' : 'Missing');

    // Ensure the request is a POST
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceInBsv } = req.body;

    if (!priceInBsv) {
      console.error('No priceInBsv provided:', req.body);
      return res.status(400).json({ error: 'Missing priceInBsv' });
    }

    // Verify environment variables
    if (!process.env.HANDCASH_APP_ID || !process.env.HANDCASH_APP_SECRET) {
      console.error('HandCash env vars missing:', {
        hasAppId: !!process.env.HANDCASH_APP_ID,
        hasAppSecret: !!process.env.HANDCASH_APP_SECRET
      });
      return res.status(500).json({ error: 'HandCash configuration missing' });
    }

    // Validate priceInBsv
    const amount = parseFloat(priceInBsv);
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid priceInBsv:', priceInBsv);
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    console.log('Payment amount:', amount);

    // Create payment request using HandCash Payment Requests API
    const paymentParameters = {
      payments: [
        {
          destination: 'styraks@handcash.io',
          currencyCode: 'BSV',
          amount: amount
        }
      ],
      redirectUrls: {
        success: 'https://doc-dime-2.vercel.app/success',
        decline: 'https://doc-dime-2.vercel.app/decline'
      }
    };

    console.log('Payment request params:', JSON.stringify(paymentParameters));

    // Send HTTP POST to HandCash Payment Requests API
    const response = await axios.post(
      'https://cloud.handcash.io/v2/paymentRequests',
      paymentParameters,
      {
        headers: {
          'app-id': process.env.HANDCASH_APP_ID,
          'app-secret': process.env.HANDCASH_APP_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('HandCash API response:', response.data);

    // Send response
    res.status(200).json({
      paymentRequestUrl: response.data.paymentRequestUrl
    });
  } catch (error) {
    console.error('Error in initiate-payment:', {
      message: error.message,
      stack: error.stack
    });
    if (error.response) {
      console.error('HandCash API error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
