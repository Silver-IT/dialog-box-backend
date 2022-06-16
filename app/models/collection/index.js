const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  base_uri: {
    type: String,
    required: true,
  },
  logo_uri: {
    type: String,
    required: true,
  },
  max_supply: {
    type: Number,
    required: true,
  },
  mint_price: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("collections", collectionSchema);
