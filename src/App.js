import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [bsvPrice, setBsvPrice] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchBSVPrice() {
      try {
        console.log("Fetching BSV price, attempt: 1");
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd"
        );
        console.log("CoinGecko response.data:", response.data);
        if (
          response.data &&
          response.data["bitcoin-sv"] &&
          typeof response.data["bitcoin-sv"].usd === "number"
        ) {
          setBsvPrice(response.data["bitcoin-sv"].usd);
        } else {
          setFetchError("Invalid response structure from CoinGecko");
          console.error("Unexpected CoinGecko response:", response.data);
        }
      } catch (error) {
        setFetchError("Failed to fetch BSV price");
        console.error("Failed to fetch BSV price:", error);
      }
    }

    fetchBSVPrice();
  }, []);

  return (
    <div className="App">
      <h1>DocDime</h1>
      <p>
        Current BSV Price:{" "}
        {bsvPrice !== null ? `$${bsvPrice}` : fetchError || "Loading..."}
      </p>
      {/* Example usage of DocumentUpload and PaymentModal */}
      {/* <DocumentUpload ...props /> */}
      {/* <PaymentModal ...props /> */}
    </div>
  );
}

export default App;