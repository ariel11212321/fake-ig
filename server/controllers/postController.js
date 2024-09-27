const postService = require('../services/postService');

const createPost = async (req, res) => {
    try {
        const { caption, tags, location, createdBy } = req.body;
        const image = req.file ? req.file.filename : null;

       
        const newPost = await postService.createPost({ caption, tags, location, createdBy, image });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserPosts = async(req, res) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getUserPosts(userId);
        res.send(posts);
    } catch(error) {
        res.status(500).send('error fetching user posts');
    }
}

const getPostById = async(req, res) => {
    try {
        const { id } = req.params;
        const posts = await postService.getPostById(id);
        res.send(posts);
    } catch(error) {
        res.status(500).send('error fetching post');
    }
}

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { caption, tags, location } = req.body;
        const image = req.file ? req.file.filename : null;

        const updatedPost = await postService.updatePost(id, { caption, tags, location, image });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error('Error updating post', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await postService.deletePost(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post', error);
        res.status(500).json({ err: 'Internal server error' });
    }
};
const getPosts = async(req, res) => {
    try {
        const posts = await postService.getPosts();
        return res.send(posts);
    } catch(error) {
        res.status(500).send("error getting posts");
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
