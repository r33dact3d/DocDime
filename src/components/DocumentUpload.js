import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { HandCashConnect } from '@handcash/handcash-connect';

function DocumentUpload({ addDocument, onLogin }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [sellerHandle, setSellerHandle] = useState(null);

  const handCashConnect = new HandCashConnect({
    appId: process.env.REACT_APP_HANDCASH_APP_ID,
  });

  const handleConnect = async () => {
    try {
      const redirectUrl = handCashConnect.getRedirectionUrl();
      window.location.href = redirectUrl; // Redirect to HandCash login
    } catch (err) {
      setError('Failed to connect with HandCash.');
      console.error('HandCash connect error:', err.message);
    }
  };

  // Handle callback after HandCash redirect (assumes redirect back to app)
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');
    if (authToken) {
      const account = handCashConnect.getAccountFromAuthToken(authToken);
      const profile = await account.profile.getCurrentProfile();
      setSellerHandle(profile.publicInfo.handle);
      onLogin(authToken); // Store in App.js
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    setError('');
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
        price: parseFloat(price), // Price in USD
        hash,
        sellerHandle, // Store seller's HandCash handle
      });
      setFile(null);
      setPrice('');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // Check for authToken on load (after redirect)
  React.useEffect(() => {
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
