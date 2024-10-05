const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const createComment = async(text, author, post_id) => {
    try {
        const post = await Post.findOne({_id: post_id});
        if(!post) {
            throw Error('post not found');
        }
        const comment = new Comment({text, author});
        await comment.save();
        post.comments.push(comment._id);
        await post.save();
        return comment;
    } catch(e) {
        throw e;
    }
}

const getComment = async(id) => {
    try {
        const comment = await Comment.findOne({_id: id});
        const user = await User.findOne({_id:comment?.author});
        if(comment && user) {
        comment.author = user.username;
        return comment;
        } else {
            throw Error('comment not found');
        }
    } catch(e) {
        throw e;
    }
}

module.exports  = {
    createComment,
    getComment
}