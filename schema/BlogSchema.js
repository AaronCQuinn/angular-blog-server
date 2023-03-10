const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    postedBy: { type: String, required: true, trim: true }
}, {timestamps: true});

module.exports = mongoose.model('Blogs', BlogSchema);