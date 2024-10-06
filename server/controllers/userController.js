const jwt = require('jsonwebtoken');
const userService = require('../services/userService');


exports.getUserById = async(req, res) => {
    try {
        const {userId} = req.params;

        const user = await userService.getUserById(userId);
        if(!user) {
            res.status(404).send({message: "user not found"});
        } else {
            res.send(user);
        }
    } catch(e) {
        res.status(500).send({message: e.message});
    }
}

exports.savePost = async(req, res) => {
    try {
        const {postId, userId} = req.body;
        const res = await userService.savePost(postId, userId);
        return res.send({msg: res});
    } catch(e) {
        throw e;
    }
}

exports.unsavePost = async(req, res) => {
    try {
        const {postId, userId} = req.body;
        const res = await userService.unsavePost(postId, userId);
        return res.send({msg: res});
    } catch(e) {
        throw e;
    }
}


