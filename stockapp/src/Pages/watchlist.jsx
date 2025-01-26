import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Watchlist = () => {
  const [watchlistStocks, setWatchlistStocks] = useState([]);
  const [stocksData, setStocksData] = useState({});
  const userEmail = "user@example.com"; // Replace with actual user email

  // Fetching stock data once at the start
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stocks");
        const data = await response.json();

        const stocksData = data.reduce((acc, stock) => {
          acc[stock.symbol] = stock;
          return acc;
        }, {});

        setStocksData(stocksData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
  }, []);

  // Fetching user's watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/watchlist/${userEmail}`);
        const data = await response.json();
        if (Array.isArray(data.stocks)) {
          setWatchlistStocks(data.stocks);
        } else {
          setWatchlistStocks([]);
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setWatchlistStocks([]);
      }
    };

    fetchWatchlist();
  }, [userEmail]);

  // Removing stock from watchlist
  const removeFromWatchlist = async (stockSymbol) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/watchlist?userEmail=${userEmail}&stockSymbol=${stockSymbol}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setWatchlistStocks((prev) => prev.filter((stock) => stock !== stockSymbol));
        alert(`${stockSymbol} removed from your watchlist!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to remove ${stockSymbol}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  // Buying stock
  const buyStock = async (stockSymbol) => {
    const stock = stocksData[stockSymbol];
    if (!stock) return;

    const quantity = 1; // Assuming quantity is 1, can be changed to user input
    const purchasePrice = stock.regularMarketPrice;

    try {
      const response = await fetch("http://localhost:5000/api/portfolio/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, stockSymbol, quantity, purchasePrice }),
      });

      if (response.ok) {
        alert(`${stock.symbol} bought successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to buy ${stock.symbol}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error buying stock:", error);
    }
  };

  return (
    <div className="watchlist bg-dark">
      <Header />
      <h2>Your Watchlist</h2>
      {watchlistStocks.length > 0 ? (
        <div className="stock-cards">
          {watchlistStocks.map((stockSymbol) => {
            const stock = stocksData[stockSymbol];
            if (!stock) return <p key={stockSymbol}>Loading {stockSymbol}...</p>;

            return (
              <div key={stockSymbol} className="stock-card">
                <h3>{stock.symbol}</h3>
                <p>Price: ${stock.regularMarketPrice}</p>
                <p
                  style={{
                    color: stock.regularMarketChangePercent > 0 ? "green" : "red",
                  }}
                >
                  Change: {stock.regularMarketChangePercent.toFixed(2)}%
                </p>
                <button onClick={() => removeFromWatchlist(stock.symbol)}>Remove</button>
                <button onClick={() => buyStock(stock.symbol)}>Buy</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No stocks in your watchlist.</p>
      )}
      <Footer />
    </div>
  );
};

export default Watchlist;
