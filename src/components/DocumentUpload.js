import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const MIN_PRICE = 0.10; // Minimum price in USD

function DocumentUpload({ addDocument, onLogin }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [sellerHandle, setSellerHandle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Restore file/price from localStorage
  useEffect(() => {
    const savedFile = localStorage.getItem('uploadFile');
    const savedPrice = localStorage.getItem('uploadPrice');
    if (savedPrice) setPrice(savedPrice);
    // File input can't be set programmatically, but price persists
  }, []);

  const handleConnect = async () => {
    try {
      // Save price to localStorage (file handled via input)
      if (price) localStorage.setItem('uploadPrice', price);
      const response = await axios.get('/api/handcash-auth', {
        params: { redirectUrl: 'http://localhost:3000/auth-callback' },
      });
      window.location.href = response.data.redirectUrl; // Redirect to HandCash
    } catch (err) {
      setError('Failed to connect with HandCash.');
      console.error('HandCash connect error:', err.message, err.response?.data);
    }
  };

  // Handle callback after HandCash redirect
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');
    if (authToken) {
      try {
        const response = await axios.get('/api/handcash-profile', {
          params: { authToken },
        });
        setSellerHandle(response.data.handle);
        onLogin(authToken);
        localStorage.removeItem('uploadPrice'); // Clear after login
      } catch (err) {
        setError('Failed to fetch HandCash profile. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`File size must be less than 1MB. Current size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`);
        e.target.value = ''; // Reset file input
        return;
      }
      setFile(selectedFile);
      setError('');
    }
    // Save file name to localStorage (not file itself)
    if (e.target.files[0]) {
      localStorage.setItem('uploadFile', e.target.files[0].name);
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    if (e.target.value === '') {
      setPrice('');
      setError('');
      return;
    }
    if (isNaN(newPrice)) {
      setError('Please enter a valid price');
      return;
    }
    if (newPrice < MIN_PRICE) {
      setError(`Minimum price is $${MIN_PRICE.toFixed(2)}`);
    } else {
      setError('');
    }
    setPrice(e.target.value);
    localStorage.setItem('uploadPrice', e.target.value);
  };

  const validateSubmission = () => {
    if (!file) {
      setError('Please select a file');
      return false;
    }
    if (!price || isNaN(parseFloat(price))) {
      setError('Please enter a valid price');
      return false;
    }
    if (parseFloat(price) < MIN_PRICE) {
      setError(`Minimum price is $${MIN_PRICE.toFixed(2)}`);
      return false;
    }
    if (!sellerHandle) {
      setError('Please connect with HandCash');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 1MB');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateSubmission()) {
      return;
    }
    setIsLoading(true);
    setUploadProgress(10);

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const hash = CryptoJS.SHA256(fileContent).toString();
      addDocument({
        name: file.name,
        price: parseFloat(price),
        hash,
        sellerHandle,
      });
      setFile(null);
      setPrice('');
      setError('');
      localStorage.removeItem('uploadFile');
      localStorage.removeItem('uploadPrice');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {!sellerHandle && (
        <button type="button" onClick={handleConnect}>
          Connect with HandCash
        </button>
      )}
      {sellerHandle && <p>Connected as {sellerHandle}</p>}
      <input
        type="file"
        accept=".pdf,.png,.jpg,.mp4,.zip,.rar,.mp3"
        onChange={handleFileChange}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price in USD (e.g., 0.10)"
        value={price}
        onChange={handlePriceChange}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Document'}
      </button>
      {error && <p className="error">{error}</p>}
      {isLoading && (
        <div className="upload-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          />
          <span>{uploadProgress}%</span>
        </div>
      )}
    </form>
  );
}

export default DocumentUpload;
