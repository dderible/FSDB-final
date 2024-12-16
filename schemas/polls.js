import { Schema, model } from "mongoose";

const pollsSchema = new Schema({
    question: { type: String, required: true, },

    options: [{
        answer: { type: String, required: true, },
        votes: { type: Number, default: 0, },
        },],
});

const Polls = model("Polls", pollsSchema);

export default Polls;