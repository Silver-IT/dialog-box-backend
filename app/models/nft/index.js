const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
    metadata_id: {
        type: String,
        required: true
    },
    token_id: {
        type: Number
    },
    collection_address: {
        type: String,
        required: true
    },
    metadata: {
        type: String,
        required: true
    },
    royalty_fraction: {
        type: String,
        required: true
    },
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model("nfts", nftSchema);