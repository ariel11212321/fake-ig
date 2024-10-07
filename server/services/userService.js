const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

const unsavePost = async (userId, postId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if ((!user.savedPosts) || (!user.savedPosts.includes(postId))) {
        const error = new Error('Post is not currently saved');
        error.statusCode = 400;
        throw error;
    }

    await User.updateOne(
        { _id: userId },
        { $pull: { savedPosts: postId } }
    );

    return { message: "Post unsaved successfully" };
};

const savePost = async (userId, postId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    

    if (user.savedPosts.includes(postId)) {
        const error = new Error('Post is already saved');
        error.statusCode = 400;
        throw error;
    }

    await User.updateOne(
        { _id: userId },
        { $addToSet: { savedPosts: postId } }
    );

    return { message: "Post saved successfully" };
};

module.exports = {
    getUserById,
    unsavePost,
    savePost
};