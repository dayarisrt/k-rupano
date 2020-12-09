const mongoose = require('mongoose');
const { Schema } = mongoose;

const StateSchema = new Schema({
    description: { type: String, required: true },
    style: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('State', StateSchema)