const users = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (username, email, password, photoFile) => {
    try {
        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return { error: 'Username already taken' };
        }
        const existingEmail = await users.findOne({ email });
        if (existingEmail) {
            return { error: 'Email already in use' };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        

        const photoPath = photoFile ? photoFile.path : null;

        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            photo: photoPath 
        });
        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        return {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                photo: newUser.photo
            },
            token
        };
    } catch (err) {
        throw err;
    }
};

const login = async (username, password) => {
    try {

        const user = await users.findOne({ username });
        if (!user) {
            throw new Error("user not found"); 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('invalid password');
        }
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                photo: user.photo
            },
            token
        };
    } catch (err) {
        throw new Error('Login failed');
    }
};

module.exports = {login, register};
