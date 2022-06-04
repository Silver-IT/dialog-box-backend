const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
    },
    init_base_uri: {
        type: String,
    },
    init_logo_uri: {
        type: String,
        required: true
    },
    max_supply: {
        type: String,
    },
    mint_price: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("collections", collectionSchema);