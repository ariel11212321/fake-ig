const commentService = require('../services/commentService');

const createComment = async (req, res) => {
    try {
        const { text, author } = req.body;
        const { postId } = req.params;
        const comment = await commentService.createComment({ text, author, postId });
        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentService.getComment(id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const updatedComment = await commentService.updateComment(id, { text });
        res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await commentService.deleteComment(id);
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentService.getPostComments(postId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
const likeComment = async(req, res) => {
    try {
        const {id, userId} = req.params;
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const unlikeComment = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
module.exports = {
    createComment,
    getComment,
    updateComment,
    deleteComment,
    getPostComments,
    likeComment,
    unlikeComment
};