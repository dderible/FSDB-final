const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema({
    question: { type: String, required: true, },

    options: [{
        answer: { type: String, required: true, },
        votes: { type: Number, default: 0, },
        },],
});

const Polls = mongoose.model("Polls", pollsSchema);

module.exports = Polls;