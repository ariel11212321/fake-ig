const Post = require('../models/Post');

const createPost = async (postData) => {
    try {
        const post = new Post(postData); 
        return await post.save();
    } catch (error) {
        throw new Error('Error creating post');
    }
};

const updatePost = async (id, updatedData) => {
    try {
        const post = await Post.findById(id);
        if (!post) {
            return null; 
        }
        if (updatedData.caption) post.caption = updatedData.caption;
        if (updatedData.tags) post.tags = updatedData.tags;
        if (updatedData.location) post.location = updatedData.location;
        if (updatedData.image) post.image = updatedData.image;
        
        return await post.save();
    } catch (error) {
        throw new Error('Error updating post');
    }
};

const deletePost = async (id) => {
    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return null;
        }
        return post;
    } catch (error) {
        throw new Error('Error deleting post');
    }
};

const getPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        throw error;
    }
};

const getUserPosts = async(userId) => {
    try {
        const posts = await Post.find({createdBy: userId});
        return posts;
    } catch(error) {
        throw error;
    }
}

const getPostById = async(id) => {
    try {
        const post = await Post.findOne({_id: id});
        return post;
    } catch(error) {
        throw error;
    }
}


module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getUserPosts,
    getPostById
};
