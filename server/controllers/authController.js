const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login({ username, password });
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const photoFile = req.file;
        const result = await authService.register({ username, email, password, photoFile });
        res.status(201).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { login, register };