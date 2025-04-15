import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function DocumentUpload({ addDocument }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

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
    if (!file || !price) {
      setError('Please select a file and set a price.');
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
        hash
      });
      setFile(null);
      setPrice('');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit}>
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
