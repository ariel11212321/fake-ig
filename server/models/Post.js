const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],  
        default: [],     
    },
    location: {
        type: String,
        trim: true,
    },
    image: {
        type: String,   
        required: true,
    },
    likes: {
        type: Number,
        default: 0,     
    },
    comments: [{
        type: [String],
        default: []
    }],
    createdAt: {
        type: Date,
        default: Date.now,  
    },
    updatedAt: {
        type: Date,
        default: Date.now, 
    },
    createdBy: {
        type: String
    }
   
});


PostSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
