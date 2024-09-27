const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { login, register, getUserById } = require('../controllers/userController');
const upload = require('../config/upload'); 

router.post("/login", login);
router.post("/register", upload.single('photo'), register); 
router.get('/user/:userId', authenticate, getUserById);
module.exports = router;
