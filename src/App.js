import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DocumentUpload from './components/DocumentUpload';
import './App.css';

function App() {
  const [bsvPrice, setBsvPrice] = useState(null);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    const fetchBsvPrice = async () => {
      try {
        const response = await axios.get('/api/bsv-price');
        const price = response.data['bitcoin-cash-sv']?.usd;
        
        if (price) {
          setBsvPrice(price);
          setPriceError(null);
        } else {
          throw new Error('Invalid price data');
        }
      } catch (error) {
        console.error('Failed to fetch BSV price:', error);
        setPriceError('Unable to fetch BSV price. Using fallback.');
        setBsvPrice(50); // Fallback price
      }
    };

    fetchBsvPrice();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>DocDime: Micro-media for a Dime</h1>
        <div className="bsv-price-display">
          {priceError && <p style={{ color: 'red' }}>{priceError}</p>}
          <p>Current BSV Price: {bsvPrice ? `$${bsvPrice.toFixed(2)}` : 'Loading...'}</p>
        </div>
      </header>
      
      <main>
        <DocumentUpload />
      </main>
      
      <footer>
        <p> 2025 DocDime - Secure Micro-media Marketplace</p>
      </footer>
    </div>
  );
}

export default App;