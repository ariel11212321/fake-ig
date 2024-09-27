const users = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUserById = async (userId) => {
    try {
      const user = users.findOne({_id: userId});
      return user;  
    } catch(error) {
        throw error;
    }
}
exports.register = async (username, email, password, photoFile) => {
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
        throw new Error('Registration failed');
    }
};

exports.login = async (username, password) => {
    try {

        const user = await users.findOne({ username });
        if (!user) {
            return "user not found"; 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return "invalid password";
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
