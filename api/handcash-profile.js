const { HandCashConnect } = require('@handcash/handcash-connect');

module.exports = async (req, res) => {
  try {
    const { authToken } = req.query;

    if (!authToken) {
      console.error('Missing authToken');
      return res.status(400).json({ error: 'Missing authToken' });
    }

    const handCashConnect = new HandCashConnect({
      appId: process.env.HANDCASH_APP_ID,
      appSecret: process.env.HANDCASH_APP_SECRET,
    });

    const account = handCashConnect.getAccountFromAuthToken(authToken);
    const profile = await account.profile.getCurrentProfile();

    console.log('HandCash profile:', profile.publicInfo.handle);

    res.status(200).json({ handle: profile.publicInfo.handle });
  } catch (error) {
    console.error('Error in handcash-profile:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};
