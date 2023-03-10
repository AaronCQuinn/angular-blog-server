const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, required: true, trim: true },
    postedBy: { type: String, required: true, trim: true },
    commentOn: {type: Schema.Types.ObjectId, ref: 'Blog'},
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);