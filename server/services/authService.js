const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async ({ username, email, password, photoFile }) => {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        const field = existingUser.username === username ? 'Username' : 'Email';
        const error = new Error(`${field} already in use`);
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const photoPath = photoFile ? photoFile.path : null;

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        photo: photoPath
    });
    await newUser.save();

    const token = generateToken(newUser);

    return {
        user,
        token
    };
};

const login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }
    const token = generateToken(user);
   
    
    return {
        user,
        token
    };
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};



module.exports = { login, register };