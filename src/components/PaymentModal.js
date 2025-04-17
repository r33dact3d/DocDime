import React, { useState, useEffect, useCallback } from "react";

function PaymentModal({ isOpen, onClose, onPayment, price, handleCallback }) {
  const [paying, setPaying] = useState(false);

  const handlePay = useCallback(async () => {
    setPaying(true);
    try {
      await onPayment();
      setPaying(false);
      onClose();
    } catch (error) {
      setPaying(false);
      // Handle error
    }
  }, [onPayment, onClose]);

  useEffect(() => {
    // If you need to use handleCallback, include it in the dependency array
    // For this example, we'll just include handleCallback to satisfy ESLint
  }, [handleCallback]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Pay ${price}</h2>
        <button onClick={handlePay} disabled={paying}>
          {paying ? "Processing..." : "Pay with HandCash"}
        </button>
        <button onClick={onClose} disabled={paying}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;