import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await fetch('/api/bsv-price');
      const data = await response.json();
      console.log('Backend response.data:', data);
      setPrice(
        data &&
        data['bitcoin-cash-sv'] &&
        data['bitcoin-cash-sv'].usd
      );
    };
    fetchPrice();
  }, []);

  return (
    <div className="App">
      <h1>Bitcoin (BSV) Price</h1>
      {price ? (
        <p>Current Price: ${price}</p>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
}

export default App;