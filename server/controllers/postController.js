const postService = require('../services/postService');

const createPost = async (req, res) => {
    try {
        const { caption, tags, location, createdBy } = req.body;
        const image = req.file ? req.file.filename : null;
        const newPost = await postService.createPost({ caption, tags, location, createdBy, image });
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getUserPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getUserSavedPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getUserSavedPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        if(!userId) {
            return res.status(400).send({message: "user id is not defined"});
        }
        const result = await postService.likePost(postId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        if(!userId) {
            return res.status(400).send({message: "user id is not defined"});
        }
        const result = await postService.unlikePost(postId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { caption, tags, location } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const updatedPost = await postService.updatePost(id, { caption, tags, location, image });
        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await postService.deletePost(id);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getUserPosts,
    getUserSavedPosts,
    getPostById,
    unlikePost,
    likePost
};