import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentModal({ document, onClose, bsvPrice, userAuthToken, onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const priceInBsv = bsvPrice ? (document.price / bsvPrice).toFixed(8) : 'Loading...';

  const handleConnect = async () => {
    try {
      const response = await axios.get('/api/handcash-auth', {
        params: { redirectUrl: 'https://doc-dime-2.vercel.app/auth-callback' },
      });
      window.location.href = response.data.redirectUrl; // Redirect to HandCash
    } catch (err) {
      setError('Failed to connect with HandCash.');
      console.error('HandCash connect error:', err.message, err.response?.data);
    }
  };

  // Handle callback after HandCash redirect
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');
    if (authToken) {
      try {
        const response = await axios.get('/api/handcash-profile', {
          params: { authToken },
        });
        onLogin(authToken);
      } catch (err) {
        setError('Failed to fetch HandCash profile. Please try again.');
        console.error('Profile error:', err.message, err.response?.data);
      }
    }
  };

  const handlePayment = async () => {
    if (!bsvPrice) {
      setError('BSV price not available. Please try again later.');
      return;
    }
    if (!userAuthToken) {
      setError('Please connect with HandCash to pay.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/initiate-payment', {
        priceInBsv,
        authToken: userAuthToken,
        sellerHandle: document.sellerHandle,
      });
      window.location.href = response.data.paymentRequestUrl; // Triggers HandCash dialog
    } catch (err) {
      setError(
        err.response?.data?.error || 'Payment initiation failed. Please try again.'
      );
      setLoading(false);
      console.error('Payment error:', err.message, err.response?.data);
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div className="modal">
      <h2>Purchase {document.name}</h2>
      <p>
        Price: ${document.price.toFixed(2)} USD{' '}
        {bsvPrice ? `(${priceInBsv} BSV)` : '(Loading...)'}
      </p>
      {!userAuthToken && (
        <button type="button" onClick={handleConnect}>
          Connect with HandCash
        </button>
      )}
      {userAuthToken && <p>Connected for payment</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handlePayment}
        disabled={loading || !bsvPrice || !userAuthToken}
      >
        {loading ? 'Processing...' : 'Pay with HandCash'}
      </button>
      <p style={{ color: 'gray' }}>
        Download available after BSV blockchain integration.
      </p>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default PaymentModal;
