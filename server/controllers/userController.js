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

exports.login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await userService.login(username, password);
        if(!user) {
            res.status(404).send({message: "user not found"});
        } else {
            res.send(user);
        }
    } catch(e) {
        res.status(500).send({message: "an error occured"});
    }
}


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const photoFile = req.file; 
        const result = await userService.register(username, email, password, photoFile);
        if (result.error) {
            return res.status(400).send({ message: result.error });
        }
        res.status(201).send(result); 
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};