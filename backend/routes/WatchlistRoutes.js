const express = require("express");
const Watchlist = require("../models/WatchListModel");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const watchlist = await Watchlist.findOne({ user: userId });
    res.status(200).json(watchlist || { stocks: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});

router.post("/add", async (req, res) => {
  const { stockSymbol } = req.body;
  const userId = req.user.id;

  try {
    let watchlist = await Watchlist.findOne({ user: userId });

    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, stocks: [] });
    }

    if (!watchlist.stocks.includes(stockSymbol)) {
      watchlist.stocks.push(stockSymbol);
    }

    await watchlist.save();
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to add stock to watchlist" });
  }
});

module.exports = router;
