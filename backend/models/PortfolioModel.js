const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  stocks: [
    {
      stockSymbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
