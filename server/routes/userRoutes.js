const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserById, savePost, unsavePost } = require('../controllers/userController');
const upload = require('../config/upload'); 


router.get('/user/:userId', authenticate, getUserById);
router.post('/user/save', authenticate, savePost);
router.post('/user/unsave', authenticate, unsavePost);
module.exports = router;
