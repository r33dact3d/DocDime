import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import PaymentModal from './components/PaymentModal';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [bsvPrice, setBsvPrice] = useState(null);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    const fetchBsvPrice = async () => {
      try {
        console.log('Fetching BSV price with key:', process.env.REACT_APP_COINGECKO_API_KEY ? 'Set' : 'Missing');
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd',
          {
            headers: {
              'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_API_KEY
            }
          }
        );
        console.log('CoinGecko response:', response.data);
        if (!response.data['bitcoin-sv'] || !response.data['bitcoin-sv'].usd) {
          throw new Error('Invalid CoinGecko response');
        }
        setBsvPrice(response.data['bitcoin-sv'].usd);
        setPriceError(null);
      } catch (error) {
        console.error('Failed to fetch BSV price:', error.message, error.response?.data);
        setPriceError('Failed to load BSV price. Using fallback.');
        // Fallback: $50 USD per BSV
        setBsvPrice(50);
      }
    };
    fetchBsvPrice();
  }, []);

  const addDocument = (document) => {
    setDocuments([...documents, document]);
  };

  const handleBuy = (document) => {
    setSelectedDocument(document);
  };

  return (
    <Router>
      <div className="App">
        <h1>DocDime: Micro-media for a Dime</h1>
        {priceError && <p style={{ color: 'red' }}>{priceError}</p>}
        <DocumentUpload addDocument={addDocument} />
        <Routes>
          <Route
            path="/"
            element={
              <DocumentList
                documents={documents}
                handleBuy={handleBuy}
                bsvPrice={bsvPrice}
              />
            }
          />
          <Route path="/success" element={<div>Payment Successful!</div>} />
          <Route path="/decline" element={<div>Payment Declined.</div>} />
        </Routes>
        {selectedDocument && (
          <PaymentModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            bsvPrice={bsvPrice}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
