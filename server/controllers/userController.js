const jwt = require('jsonwebtoken');
const userService = require('../services/userService');


exports.getUserById = async(req, res) => {
    try {
        const {userId} = req.params;

        const user = await userService.getUserById(userId);
        res.status(200).send(user);
    } catch(e) {
        res.status(500).send({message: e.message});
    }
}

exports.savePost = async (req, res) => {
    try {
        const { userId } = req.params;
        const { postId } = req.body;
        
        if (!postId) {
            return res.status(400).json({ error: 'postId is required in the request body' });
        }
        const result = await userService.savePost(userId, postId);
        return res.status(201).json({ message: 'Post saved successfully', data: result });
    } catch (error) {
        console.error('Error in savePost:', error);
        return res.status(500).json({ error: 'An error occurred while saving the post' });
    }
};

exports.unsavePost = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const result = await userService.unsavePost(userId, postId);
        return res.status(200).json({ message: 'Post unsaved successfully', data: result });
    } catch (error) {
        console.error('Error in unsavePost:', error);
        return res.status(500).json({ error: 'An error occurred while unsaving the post' });
    }
};


