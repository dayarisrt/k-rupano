const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    url_image: { type: String, required: true },
    active: { type: Boolean, default: true },
    done: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true}
});

module.exports = mongoose.model('Article', ArticleSchema)