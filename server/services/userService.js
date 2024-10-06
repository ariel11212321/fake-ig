const users = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const getUserById = async (userId) => {
    try {
      const user = users.findOne({_id: userId});
      return user;  
    } catch(error) {
        throw error;
    }
}

const unsavePost = async (postId, userId) => {
    try {
        const user = await users.findById(userId);
        if(!user) {
            throw new Error('user not found');
        }
        if (!user.savedPosts) {
            user.savedPosts = [];
        }
        if(user.savedPosts.includes(postId)) {
            await users.updateOne(
                { _id: userId },
                { $pull: { savedPosts: postId } }
            );
            return "post unsaved successfully"; 
        } else {
            throw new Error('post is not currently saved');
        }
    } catch(error) {
        throw error;
    }
}

const savePost = async (postId, userId) => {
    try {
        const user = await users.findById(userId);
        if(!user) {
            throw new Error('user not found');
        }
        if (!user.savedPosts) {
            user.savedPosts = [];
        }
        if(!user.savedPosts.includes(postId)) {
            await users.updateOne(
                { _id: userId },
                { $addToSet: { savedPosts: postId } }
            );
            return "post saved successfully"; 
        } else {
            throw new Error('post is already saved');
        } 
    } catch(error) {
        throw error;
    }
}



module.exports = {
    getUserById,
    unsavePost,
    savePost
}