import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [price, setPrice] = useState(0.10); // Minimum $0.10 price
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    
    // Validate file size (≤1MB)
    if (selectedFile.size > 1 * 1024 * 1024) {
      setUploadError('File must be 1MB or smaller');
      return;
    }

    // Generate SHA-256 hash
    const arrayBuffer = await selectedFile.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const hash = CryptoJS.SHA256(wordArray).toString();

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileHash(hash);
    setUploadError(null);
  };

  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value);
    // Enforce minimum $0.10 price
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('fileHash', fileHash);
      formData.append('price', price);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // TODO: Integrate with HandCash payment flow
      console.log('Upload successful:', response.data);
      
      // Reset form
      setFile(null);
      setFileName('');
      setFileHash('');
      setPrice(0.10);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <h2>Upload Document</h2>
      
      <input 
        type="file" 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
      />
      
      {fileName && (
        <div>
          <p>File: {fileName}</p>
          <p>File Hash: {fileHash}</p>
        </div>
      )}
      
      <div>
        <label>
          Price (minimum $0.10):
          <input 
            type="number" 
            value={price} 
            onChange={handlePriceChange}
            min="0.10"
            step="0.01"
          />
        </label>
      </div>
      
      {uploadError && (
        <div style={{ color: 'red' }}>
          {uploadError}
        </div>
      )}
      
      <button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
};

export default DocumentUpload;