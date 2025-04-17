import React, { useState, useEffect } from 'react';
import styles from './DocumentUpload.module.css';
import axios from 'axios';
import CryptoJS from 'crypto-js';

function DocumentUpload({ addDocument, onLogin }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [sellerHandle, setSellerHandle] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const savedFile = localStorage.getItem('uploadFile');
    const savedPrice = localStorage.getItem('uploadPrice');
    if (savedPrice) setPrice(savedPrice);
    handleCallback(); // Check for auth callback on mount
  }, []);

  const handleConnect = async () => {
    try {
      if (price) localStorage.setItem('uploadPrice', price);
      const response = await axios.get('/api/handcash-auth', {
        params: { redirectUrl: window.location.origin + '/auth-callback' }
      });
      window.location.href = response.data.redirectUrl;
    } catch (err) {
      setError('Failed to connect with HandCash.');
      console.error('HandCash connect error:', err.message, err.response?.data);
    }
  };

  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');
    if (authToken) {
      try {
        const response = await axios.get('/api/handcash-profile', {
          params: { authToken }
        });
        setSellerHandle(response.data.handle);
        onLogin(authToken);
        localStorage.removeItem('uploadPrice');
      } catch (err) {
        setError('Failed to fetch HandCash profile. Please try again.');
        console.error('Profile error:', err.message, err.response?.data);
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError('');
    
    if (selectedFile) {
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (selectedFile.size > maxSize) {
        setError('File size exceeds 1MB limit.');
        setFile(null);
        return;
      }
      localStorage.setItem('uploadFile', selectedFile.name);
    }
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    setPrice(value);
    setError('');
    
    if (value && parseFloat(value) < 0.10) {
      setError('Minimum price is $0.10');
    }
    localStorage.setItem('uploadPrice', value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !price || !sellerHandle) {
      setError('Please connect with HandCash, select a file, and set a price.');
      return;
    }

    if (parseFloat(price) < 0.10) {
      setError('Minimum price is $0.10');
      return;
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setError('File size exceeds 1MB limit.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // First, calculate file hash
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const hash = CryptoJS.SHA256(fileContent).toString();

        // Create the document metadata
        const document = {
          name: file.name,
          price: parseFloat(price),
          hash,
          sellerHandle,
          size: file.size,
          type: file.type
        };

        // Add document to the list and clear form
        addDocument(document);
        setFile(null);
        setPrice('');
        setError('');
        setUploading(false);
        setUploadProgress(100);
        
        // Clear localStorage
        localStorage.removeItem('uploadFile');
        localStorage.removeItem('uploadPrice');
      };

      reader.onerror = () => {
        setError('Error reading file.');
        setUploading(false);
        setUploadProgress(0);
      };

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={styles['upload-container']}>
      <form onSubmit={handleSubmit}>
        {!sellerHandle && (
          <button type="button" onClick={handleConnect} className={styles['connect-button']}>
            Connect with HandCash
          </button>
        )}
        {sellerHandle && (
          <div className={styles['seller-info']}>
            <p>Connected as {sellerHandle}</p>
            <p className={styles['helper-text']}>You can now upload files for sale</p>
          </div>
        )}

        <div className={styles['file-input-container']}>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.mp4,.zip,.rar,.mp3"
            onChange={handleFileChange}
            disabled={!sellerHandle || uploading}
          />
          <p className="helper-text">Maximum file size: 1MB</p>
        </div>

        <div className={styles['price-input-container']}>
          <input
            type="number"
            step="0.01"
            min="0.10"
            placeholder="Price in USD (minimum $0.10)"
            value={price}
            onChange={handlePriceChange}
            disabled={!sellerHandle || uploading}
            className={styles['price-input']}
          />
        </div>

        {error && <p className={styles['error-message']}>{error}</p>}

        <button 
          type="submit" 
          disabled={!sellerHandle || uploading || !file || !price || parseFloat(price) < 0.10}
          className={styles['upload-button']}
        >
          {uploading ? 'Processing...' : 'Upload for Sale'}
        </button>

        {uploading && (
          <div className={styles['upload-progress']}>
            <div
              className={styles['progress-bar']}
              style={{ width: `${uploadProgress}%` }}
            />
            <span>{uploadProgress}% Complete</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default DocumentUpload;