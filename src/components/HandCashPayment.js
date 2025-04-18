import React, { useState } from 'react';
import { HandCashConnect } from '@handcash/handcash-connect';

const HandCashPayment = ({ filePrice, onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize HandCash Connect
      const handCashConnect = new HandCashConnect({
        appId: process.env.REACT_APP_HANDCASH_APP_ID,
        appSecret: process.env.REACT_APP_HANDCASH_APP_SECRET
      });

      // Payment parameters
      const paymentParameters = {
        description: `DocDime File Purchase: $${filePrice}`,
        payments: [
          { 
            destination: 'docdime', // Our DocDime HandCash account
            currencyCode: 'BSV', 
            sendAmount: filePrice 
          }
        ]
      };

      // Execute payment
      const paymentResult = await handCashConnect.wallet.pay(paymentParameters);
      
      // Notify parent component of successful payment
      onPaymentSuccess(paymentResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="error-message">Payment Error: {error}</p>}
      <button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="handcash-payment-button"
      >
        {isLoading ? 'Processing...' : `Pay $${filePrice} with HandCash`}
      </button>
    </div>
  );
};

export default HandCashPayment;