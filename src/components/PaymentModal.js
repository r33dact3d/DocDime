import React, { useState } from 'react';
import axios from 'axios';

function PaymentModal({ document, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/initiate-payment', {
        priceInBsv: document.price
      });
      // Redirect to HandCash payment URL
      window.location.href = response.data.paymentRequestUrl;
    } catch (err) {
      setError('Payment initiation failed. Please try again.');
      setLoading(false);
      console.error('Payment error:', err.message);
    }
  };

  return (
    <div className="modal">
      <h2>Purchase {document.name}</h2>
      <p>Price: {document.price} BSV</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay with HandCash'}
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default PaymentModal;
