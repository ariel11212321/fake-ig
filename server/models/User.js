const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: String
    },
    savedPosts: {
        type: [String],
        default: []
    }
});
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
