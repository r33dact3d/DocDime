import React, { useState } from 'react';
import BSVPriceDisplay from './BSVPriceDisplay';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 1024 * 1024) {
      setError('File size exceeds 1MB limit.');
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a valid file.');
      return;
    }
    // Add logic for file upload and payment processing here
    console.log('File ready for upload:', file);
  };

  return (
    <div style={{ backgroundColor: '#ff9900', color: '#000000', padding: '20px', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Upload Your Document</h1>
      <BSVPriceDisplay />
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fileUpload" style={{ display: 'block', marginBottom: '5px' }}>
            Choose a file (max 1MB):
          </label>
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #000000' }}
          />
        </div>
        {error && <p style={{ color: '#ff0000', fontWeight: 'bold' }}>{error}</p>}
        <button
          type="submit"
          style={{
            backgroundColor: '#000000',
            color: '#ff9900',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default DocumentUpload;