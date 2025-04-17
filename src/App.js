import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [bsvPrice, setBsvPrice] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchBSVPrice() {
      try {
        const response = await axios.get(
          "[https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd"](https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-sv&vs_currencies=usd")
        );
        if (
          response.data &&
          response.data["bitcoin-sv"] &&
          typeof response.data["bitcoin-sv"].usd === "number"
        ) {
          setBsvPrice(response.data["bitcoin-sv"].usd);
        } else {
          setFetchError("Invalid response structure from CoinGecko");
        }
      } catch (error) {
        setFetchError("Failed to fetch BSV price");
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
    </div>
  );
}

export default App;