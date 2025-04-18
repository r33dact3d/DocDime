import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import HandCashPayment from './HandCashPayment';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [price, setPrice] = useState(0.10);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 1 * 1024 * 1024) {
      setUploadError('File must be 1MB or smaller');
      return;
    }
    const arrayBuffer = await selectedFile.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const hash = CryptoJS.SHA256(wordArray).toString();
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileHash(hash);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value);
    setPrice(Math.max(0.10, newPrice));
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file');
      return;
    }

    if (price < 0.10) {
      setUploadError('Minimum price is $0.10');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('price', price);
    formData.append('fileHash', fileHash);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.message) {
        setUploadSuccess(`Upload successful: ${response.data.message}`);
        setUploadError(null);
        // Reset form after successful upload
        setFile(null);
        setFileName('');
        setFileHash('');
        setPrice(0.10);
      }
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Upload failed');
      setUploadSuccess(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    // After successful payment, upload the file
    setPaymentCompleted(true);
    handleUpload();
  };

  return (
    <div className="document-upload">
      <h2>Upload Document</h2>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
      />
      {fileName && <p>Selected file: {fileName}</p>}
      <div className="price-input">
        <label>Price (min $0.10): </label>
        <input 
          type="number" 
          value={price} 
          onChange={handlePriceChange} 
          min="0.10" 
          step="0.01"
        />
      </div>
      {file && (
        <HandCashPayment 
          filePrice={price}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
      {uploadError && <div className="error-message">{uploadError}</div>}
      {uploadSuccess && <div className="success-message">{uploadSuccess}</div>}
    </div>
  );
}

export default DocumentUpload;