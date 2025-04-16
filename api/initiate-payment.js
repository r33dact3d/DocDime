const { HandCashConnect } = require('@handcash/handcash-connect');

module.exports = async (req, res) => {
  try {
    console.log('Starting initiate-payment function');

    // Log request details
    console.log('Request:', { method: req.method, body: req.body });

    // Ensure the request is a POST
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceInBsv, authToken, sellerHandle } = req.body;

    if (!priceInBsv || !authToken || !sellerHandle) {
      console.error('Missing parameters:', req.body);
      return res.status(400).json({ error: 'Missing priceInBsv, authToken, or sellerHandle' });
    }

    // Validate priceInBsv
    const amount = parseFloat(priceInBsv);
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid priceInBsv:', priceInBsv);
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    console.log('Payment amount:', amount, 'Seller:', sellerHandle);

    // Initialize HandCash client
    const handCashConnect = new HandCashConnect({
      appId: process.env.HANDCASH_APP_ID,
      appSecret: process.env.HANDCASH_APP_SECRET,
    });

    // Get buyer account with auth token
    const account = handCashConnect.getAccountFromAuthToken(authToken);

    // Calculate fee (5%) and sale price
    const feeRate = 0.05;
    const feeAmount = amount * feeRate;
    const saleAmount = amount - feeAmount;

    // Create payment parameters
    const paymentParameters = {
      description: `DocDime purchase: ${sellerHandle}`,
      payments: [
        {
          destination: sellerHandle, // Seller's HandCash handle
          currencyCode: 'BSV',
          send, // Changed from sendAmount to amount to ensure compatability
          amount: saleAmount,
        },
        {
          destination: '67f01aeeade9b3f0e486b8b9', // DocDime fee wallet
          currencyCode: 'BSV',
          amount: feeAmount,
        },
      ],
      redirectUrls: {
        success: 'https://doc-dime-2.vercel.app/success',
        decline: 'https://doc-dime-2.vercel.app/decline',
      },
    };

    console.log('Payment request params:', JSON.stringify(paymentParameters));

    // Execute payment
    const paymentResult = await account.wallet.pay(paymentParameters);

    console.log('HandCash payment result:', paymentResult);

    // Send response
    res.status(200).json({
      paymentRequestUrl: paymentResult.paymentRequestUrl || paymentResult.transactionId,
    });
  } catch (error) {
    console.error('Error in initiate-payment:', {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes('spend limit')) {
      return res.status(403).json({ error: 'Request exceeds user’s spend limit' });
    }
    if (error.message.includes('invalid auth token')) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
