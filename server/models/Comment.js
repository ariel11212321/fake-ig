const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: [String],
        default: []
    },
    replys: {
        type: [String],
        default: []
    }
   
});




module.exports = mongoose.model('Comment', CommentSchema);
