import React, { useState } from 'react';
import axios from 'axios';

function PaymentModal({ document, onClose, bsvPrice, userAuthToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const priceInBsv = bsvPrice ? (document.price / bsvPrice).toFixed(8) : 'Loading...';

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
      console.error('Payment error:', err.message);
    }
  };

  return (
    <div className="modal">
      <h2>Purchase {document.name}</h2>
      <p>
        Price: ${document.price.toFixed(2)} USD{' '}
        {bsvPrice ? `(${priceInBsv} BSV)` : '(Loading...)'}
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePayment} disabled={loading || !bsvPrice}>
        {loading ? 'Processing...' : 'Pay with HandCash'}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default PaymentModal;
