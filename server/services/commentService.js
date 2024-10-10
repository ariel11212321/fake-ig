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
    
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    
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

const likeComment = async (commentId, userId) => {
    try {
   
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } },
            { new: true }
        );

        if (!comment) {
            console.log(`Comment not found: ${commentId}`);
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }

        if(!comment.likes.includes(userId)) {
            console.log(`like did not add`);
            const error = new Error('ike did not add');
            error.statusCode = 400;
            throw error;
        }

        console.log(`Updated comment:`, comment);
        return comment.likes;
    } catch (error) {
        console.error(`Error in likeComment:`, error);
        throw error;
    }
};

const unlikeComment = async (commentId, userId) => {
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: userId } },
        { new: true }
    );

    if (!comment) {
        const error = new Error('Comment not found');
        error.statusCode = 404;
        throw error;
    }

    return comment;
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