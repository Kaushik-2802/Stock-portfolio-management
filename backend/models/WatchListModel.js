const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userEmail: {
    type: String,   // Now using email or username as a string
    required: true,
    unique: true,
  },
  stocks: [String], // Stock symbols stored as an array of strings
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;
