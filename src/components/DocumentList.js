import React from 'react';

function DocumentList({ documents, handleBuy, bsvPrice }) {
  return (
    <ul>
      {documents.map((doc, index) => (
        <li key={index}>
          <span>
            {doc.name} - ${doc.price.toFixed(2)} USD{' '}
            {bsvPrice ? `(${(doc.price / bsvPrice).toFixed(8)} BSV)` : '(Loading...)'}
          </span>
          <button onClick={() => handleBuy(doc)} disabled={!bsvPrice}>
            Buy
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DocumentList;
