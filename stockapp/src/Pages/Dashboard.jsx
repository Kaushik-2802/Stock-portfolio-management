import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const stocksPerPage = 50;

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/stocks");
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stocks.slice(indexOfFirstStock, indexOfLastStock);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToWatchlist = async (stock) => {
    const userEmail = "user@example.com"; // Replace with actual user email from authentication state or context
    
    try {
      const response = await fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          stockSymbol: stock.symbol,
        }),
      });

      if (response.ok) {
        alert(`${stock.symbol} added to your watchlist!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to add ${stock.symbol} to the watchlist: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("An error occurred while adding the stock to the watchlist.");
    }
  };

  const buyStock = async (stock) => {
    const userEmail = "user@example.com"; // Replace with actual user email
    const quantity = 1; // Assuming you are purchasing 1 share. You can replace this with user input.
    const purchasePrice = stock.regularMarketPrice; // Use the current stock price for the purchase price

    try {
      const response = await fetch("http://localhost:5000/api/portfolio/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          stockSymbol: stock.symbol,
          quantity,
          purchasePrice,
        }),
      });

      if (response.ok) {
        alert(`${stock.symbol} purchased successfully!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to purchase ${stock.symbol}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error purchasing stock:", error);
      alert("An error occurred while purchasing the stock.");
    }
  };

  return (
    <div className="app-container">
      <Header />

      {loading ? (
        <p className="loading-message">Loading stock data...</p>
      ) : stocks.length === 0 ? (
        <p className="error-message">No stock data available.</p>
      ) : (
        <>
          <div className="stock-cards-container">
            {currentStocks.map((stock, index) => (
              <div className="stock-card" key={index}>
                <p>Symbol: {stock.symbol}</p>
                <p>Price: ${stock.regularMarketPrice}</p>
                <p
                  style={{
                    color: stock.regularMarketChangePercent > 0 ? "green" : "red",
                  }}
                >
                  Change: {stock.regularMarketChangePercent.toFixed(2)}%
                </p>
                <button
                  className="watchlist-button"
                  onClick={() => addToWatchlist(stock)}
                >
                  Add to Watchlist
                </button>
                <button
                  className="buy-button"
                  onClick={() => buyStock(stock)}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            {[...Array(Math.ceil(stocks.length / stocksPerPage)).keys()].map(
              (number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={currentPage === number + 1 ? "active" : ""}
                >
                  {number + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard;
