const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("faq", faqSchema);