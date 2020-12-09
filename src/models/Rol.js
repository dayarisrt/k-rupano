const mongoose = require('mongoose');
const { Schema } = mongoose;

const RolSchema = new Schema({
    description: { type: String, required: true },
    detail: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rol', RolSchema)