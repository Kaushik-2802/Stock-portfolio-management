import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/portfolio.css";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [stockData, setStockData] = useState({});
  const userEmail = "user@example.com"; // Replace with the actual logged-in user email

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/portfolio/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);

          // Fetch real-time data for each stock
          const stockSymbols = data.stocks.map((stock) => stock.stockSymbol); // Corrected field name here
          stockSymbols.forEach(async (symbol) => {
            const stockResponse = await fetch(`http://localhost:5000/api/stocks/${symbol}`);
            const stockInfo = await stockResponse.json();
            setStockData((prevState) => ({
              ...prevState,
              [symbol]: stockInfo,
            }));
          });
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, [userEmail]);

  // Helper function to handle price change styling
  const getPriceChangeClass = (priceChange) => {
    if (priceChange > 0) {
      return "text-green-500";
    } else if (priceChange < 0) {
      return "text-red-500";
    } else {
      return "text-gray-500";
    }
  };

  return (
    <>
      <Header />
      <div className="portfolio-container">
        <h2>My Portfolio</h2>
        {portfolio ? (
          <div className="portfolio">
            {portfolio.stocks.map((stock) => {
              const stockInfo = stockData[stock.stockSymbol] || {};
              const { currentPrice, priceChange, percentChange } = stockInfo;

              return (
                <div key={stock.stockSymbol} className="stock-card">
                  <h3>{stock.stockSymbol}</h3>
                  <p>Quantity: {stock.quantity}</p>
                  <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
                  {currentPrice !== undefined && (
                    <div>
                      <p>Current Price: ${currentPrice.toFixed(2)}</p>
                      {priceChange !== undefined && (
                        <p className={getPriceChangeClass(priceChange)}>
                          Change: {priceChange > 0 ? "+" : ""}
                          ${priceChange.toFixed(2)} (
                          {percentChange > 0 ? "+" : ""}
                          {percentChange.toFixed(2)}%)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Portfolio;
