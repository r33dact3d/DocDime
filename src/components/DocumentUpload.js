import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

function DocumentUpload({ addDocument, onLogin }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [sellerHandle, setSellerHandle] = useState(null);

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
        params: { redirectUrl: 'https://doc-dime-2.vercel.app/auth-callback' },
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
        console.error('Profile error:', err.message, err.response?.data);
      }
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');
    // Save file name to localStorage (not file itself)
    if (event.target.files[0]) {
      localStorage.setItem('uploadFile', event.target.files[0].name);
    }
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    setError('');
    localStorage.setItem('uploadPrice', event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !price || !sellerHandle) {
      setError('Please connect with HandCash, select a file, and set a price.');
      return;
    }

    // Validate file size (1MB = 1,048,576 bytes)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds 1MB limit.');
      return;
    }

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
      <button type="submit">Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default DocumentUpload;
