import React from 'react';

function DocumentList({ documents, handleBuy }) {
  return (
    <ul>
      {documents.map((doc, index) => (
        <li key={index}>
          <span>{doc.name} - {doc.price} BSV</span>
          <button onClick={() => handleBuy(doc)}>Buy</button>
        </li>
      ))}
    </ul>
  );
}

export default DocumentList;
