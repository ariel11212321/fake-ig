const authService = require('../services/authService');

exports.login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const user = await authService.login(username, password);
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
        const result = await authService.register(username, email, password, photoFile);
        if (result.error) {
            return res.status(400).send({ message: result.error });
        }
        res.status(201).send(result); 
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};
