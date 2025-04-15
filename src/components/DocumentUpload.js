import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

function DocumentUpload({ addDocument }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file && price) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const hash = CryptoJS.SHA256(fileContent).toString();
        addDocument({
          name: file.name,
          price: parseFloat(price),
          hash
        });
        setFile(null);
        setPrice('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".pdf,.png,.jpg,.mp4,.zip,.rar,.mp3" onChange={handleFileChange} />
      <input
        type="number"
        step="0.0001"
        placeholder="Price in BSV"
        value={price}
        onChange={handlePriceChange}
      />
      <button type="submit">Upload</button>
    </form>
  );
}

export default DocumentUpload;
