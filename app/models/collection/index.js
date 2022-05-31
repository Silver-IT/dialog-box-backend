const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    init_base_uri: {
        type: String,
        required: true
    },
    init_logo_uri: {
        type: String,
        required: true
    },
    max_supply: {
        type: String,
        required: true
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