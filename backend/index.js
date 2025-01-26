const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;
const authRoutes = require("./routes/authRoutes");
const Portfolio = require("./models/PortfolioModel");
const Watchlist = require("./models/WatchListModel");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Fetch stock data (for stock symbols list)
app.get("/api/stocks", async (req, res) => {
  try {
    const query = [
      "AAPL", "AA", "AACG", "AACT", "AADI", "AAL", "AAM", "AAME", "ABNB", "T", "AAME", "AXP", "BA", "BABA", "BAC", "C", "MSFT", "GOOG", "AMZN", "TSLA", "NVDA", "META", "INTC", "ADBE",
      "CSCO", "CMCSA", "PEP", "AVGO", "NFLX", "TXN", "QCOM", "PYPL", "AMAT",
      "SBUX", "AMD", "COST", "BKNG", "CHTR", "INTU", "GILD", "MDLZ", "ADP", "BRK-A", "V", "JNJ", "PG", "UNH", "HD", "MA", "XOM", "BAC", "PFE",
      "DIS", "KO", "CVX", "VZ", "NKE", "WMT", "ABBV", "MRK", "PEP",
      "MCD", "BA", "IBM", "CAT", "MMM", "GS", "JPM", "AXP", "TRV", "CL"
    ];
    const data = await yahooFinance.quote(query);
    res.json(data);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Fetch stock data with changes
app.get("/api/stocks/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await yahooFinance.quote(symbol);

    const currentPrice = data.regularMarketPrice; // Current stock price
    const previousClose = data.regularMarketPreviousClose; // Previous close price

    // Calculate the change and percentage change
    const priceChange = currentPrice - previousClose;
    const percentChange = (priceChange / previousClose) * 100;

    // Send back the data including price change
    res.json({ currentPrice, priceChange, percentChange });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Add stock to the watchlist
app.post("/api/watchlist", async (req, res) => {
  try {
    const { userEmail, stockSymbol } = req.body;

    if (!userEmail || !stockSymbol) {
      return res.status(400).json({ error: "User email and stock symbol are required" });
    }

    // Find or create the watchlist for this user
    let watchlist = await Watchlist.findOne({ userEmail });

    if (!watchlist) {
      watchlist = new Watchlist({ userEmail, stocks: [] });
    }

    // Add the stock if it's not already in the watchlist
    if (!watchlist.stocks.includes(stockSymbol)) {
      watchlist.stocks.push(stockSymbol);
      await watchlist.save();
    }

    res.status(201).json({ message: "Stock added to watchlist", watchlist });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ error: "Failed to add stock to watchlist" });
  }
});

// Get watchlist for a user
app.get("/api/watchlist/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;

    // Find the watchlist for the given userEmail
    const watchlist = await Watchlist.findOne({ userEmail });
    if (!watchlist) {
      return res.status(404).json({ error: "Watchlist not found for this user" });
    }

    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

// Remove stock from the watchlist
app.delete("/api/watchlist", async (req, res) => {
  try {
    const { userEmail, stockSymbol } = req.query; // Use query parameters

    if (!userEmail || !stockSymbol) {
      return res.status(400).json({ error: "User email and Stock Symbol are required" });
    }

    const watchlist = await Watchlist.findOne({ userEmail });
    if (!watchlist) {
      return res.status(404).json({ error: "Watchlist not found for this user" });
    }

    // Remove stock from the watchlist
    watchlist.stocks = watchlist.stocks.filter((stock) => stock !== stockSymbol);
    await watchlist.save();

    res.json({ message: `${stockSymbol} removed from your watchlist`, watchlist });
  } catch (error) {
    console.error("Error removing stock from watchlist:", error);
    res.status(500).json({ error: "Failed to remove stock from watchlist" });
  }
});

// Buy stock and add it to the portfolio
app.post("/api/portfolio/buy", async (req, res) => {
  try {
    const { userEmail, stockSymbol, quantity, purchasePrice } = req.body;

    if (!userEmail || !stockSymbol || !quantity || !purchasePrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let portfolio = await Portfolio.findOne({ userEmail });

    if (!portfolio) {
      portfolio = new Portfolio({ userEmail, stocks: [] });
    }

    // Check if stock already exists in portfolio
    const existingStock = portfolio.stocks.find((stock) => stock.stockSymbol === stockSymbol);

    if (existingStock) {
      // Update quantity and adjust average purchase price
      existingStock.quantity += quantity;
      existingStock.purchasePrice =
        (existingStock.purchasePrice * (existingStock.quantity - quantity) + purchasePrice * quantity) /
        existingStock.quantity;
    } else {
      // Add a new stock entry
      portfolio.stocks.push({ stockSymbol, quantity, purchasePrice });
    }

    await portfolio.save();

    res.status(201).json({ message: `${stockSymbol} purchased successfully`, portfolio });
  } catch (error) {
    console.error("Error buying stock:", error);
    res.status(500).json({ error: "Failed to purchase stock" });
  }
});

// Fetch user's portfolio
app.get("/api/portfolio/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;

    // Find the portfolio for the given userEmail
    const portfolio = await Portfolio.findOne({ userEmail });
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found for this user" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect("mongodb://localhost:27017/stockapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
