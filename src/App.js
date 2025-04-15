import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import PaymentModal from './components/PaymentModal';
import './App.css';

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const addDocument = (document) => {
    setDocuments([...documents, document]);
  };

  const handleBuy = (document) => {
    setSelectedDocument(document);
  };

  const handlePaymentSuccess = () => {
    setSelectedDocument(null);
  };

  return (
    <Router>
      <div className="App">
        <h1>DocDime: Micro-media for a Dime</h1>
        <DocumentUpload addDocument={addDocument} />
        <Routes>
          <Route
            path="/"
            element={<DocumentList documents={documents} handleBuy={handleBuy} />}
          />
          <Route path="/success" element={<div>Payment Successful!</div>} />
          <Route path="/decline" element={<div>Payment Declined.</div>} />
        </Routes>
        {selectedDocument && (
          <PaymentModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
