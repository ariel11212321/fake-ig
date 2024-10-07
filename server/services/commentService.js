const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const createComment = async ({ text, author, postId }) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }
    
    const comment = new Comment({ text, author, post: postId });
    await comment.save();
    
    post.comments.push(comment._id);
    await post.save();
    
    return comment;
};

const getComment = async (id) => {
    const comment = await Comment.findById(id).populate('author', 'username');
    if (!comment) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        throw error;
    }
   

    return comment;
};

const updateComment = async (id, { text }) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        throw error;
    }
    
    comment.text = text;
    await comment.save();
    return comment;
};

const deleteComment = async (id) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        throw error;
    }
    
    await Post.updateOne(
        { _id: comment.post },
        { $pull: { comments: comment._id } }
    );
    
    await Comment.deleteOne({ _id: id });
};

const getPostComments = async (postId) => {
    const post = await Post.findById(postId);
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
    }
    
    return Comment.find({ post: postId }).populate('author', 'username');
};

module.exports = {
    createComment,
    getComment,
    updateComment,
    deleteComment,
    getPostComments
};