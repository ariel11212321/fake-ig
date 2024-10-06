const Post = require('../models/Post');
const User = require('../models/User');

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

const getUserSavedPosts = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const posts = await Promise.all(
            user.savedPosts.map(async postId => {
                const post = await Post.findById(postId);
                return post; 
            })
        );
        return posts.filter(post => post != null);

    } catch (error) {
        console.error('Error in getUserSavedPosts:', error);
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

const likePost = async(postId, author) => {
    try {
      const post = await Post.findOne({_id: postId});
      if(post) {
        if (!post.likes.includes(author)) {
            post.likes.push(author);
            await post.save();
            return post.likes;
        } else {
            throw Error('post already liked');
        }
      } else {
        throw Error('post not found');
      }
    } catch(e) {
        throw e;
    }
}

const unlikePost = async (postId, author) => {
    try {
        const post = await Post.findOne({_id: postId});
        if (!post) {
            throw new Error('Post not found');
        }
        const likesBefore = post.likes.length;
        post.likes = post.likes.filter(id => id !== author);

        if (post.likes.length < likesBefore) {
            await post.save();
            return { success: true, message: 'Post unliked' };
        } else {
            return { success: false, message: 'User had not liked this post' };
        }
    } catch (error) {
        throw error;
    }
}



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
