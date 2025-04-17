import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function DocumentUpload({ sellerHandle, setSellerHandle, onUpload }) {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleConnect = async () => {
    // Implement HandCash connect logic here.
    // On success, setSellerHandle with the user's handle.
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !price) return;

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("price", price);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });
      setUploading(false);
      setUploadProgress(0);
      setFile(null);
      setPrice("");
      if (onUpload) onUpload(response.data);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      // Handle error
    }
  };

  // If you have a handleCallback function, ensure it's included in the dependency array
  // For this example, we'll assume there's no handleCallback in useEffect

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
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploading && (
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