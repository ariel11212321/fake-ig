const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (postData) => {
    const post = new Post(postData);
    await post.save();
    return post;
};

const updatePost = async (id, updatedData) => {
    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }
    
    Object.assign(post, updatedData);
    await post.save();
    return post;
};

const deletePost = async (id) => {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }
    return { message: 'Post deleted successfully' };
};

const getPosts = async () => {
    return await Post.find();
};

const getUserPosts = async (userId) => {
    return await Post.find({ createdBy: userId });
};

const getUserSavedPosts = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const posts = await Post.find({ _id: { $in: user.savedPosts } });
    return posts;
};

const getPostById = async (id) => {
    const post = await Post.findById(id);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }
    return post;
};

const likePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }

    if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
    }

    return post;
};

const unlikePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }

    post.likes = post.likes.filter(id => id?.toString() !== userId);
    await post.save();

    return post;
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getUserPosts,
    getUserSavedPosts,
    getPostById,
    likePost,
    unlikePost
};