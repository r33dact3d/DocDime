import React, { useState, useEffect } from 'react';

function BSVPriceDisplay() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/bsv-price');
        if (!response.ok) {
          throw new Error('Failed to fetch BSV price');
        }
        const data = await response.json();
        const bsvPrice = data['bitcoin-cash-sv']?.usd;
        if (!bsvPrice) {
          throw new Error('Invalid price data');
        }
        setPrice(bsvPrice);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  if (loading) {
    return <p>Loading BSV price...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return <p>Current BSV Price: ${price.toFixed(2)}</p>;
}

export default BSVPriceDisplay;