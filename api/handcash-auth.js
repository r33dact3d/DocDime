const { HandCashConnect } = require('@handcash/handcash-connect');

module.exports = async (req, res) => {
  try {
    const { redirectUrl } = req.query;

    if (!redirectUrl) {
      console.error('Missing redirectUrl');
      return res.status(400).json({ error: 'Missing redirectUrl' });
    }

    const handCashConnect = new HandCashConnect({
      appId: process.env.HANDCASH_APP_ID,
      appSecret: process.env.HANDCASH_APP_SECRET,
    });

    const redirect = handCashConnect.getRedirectionUrl();
    console.log('HandCash redirect URL:', redirect);

    res.status(200).json({ redirectUrl: redirect });
  } catch (error) {
    console.error('Error in handcash-auth:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};
