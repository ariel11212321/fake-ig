const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserById, savePost, unsavePost } = require('../controllers/userController');
const upload = require('../config/upload'); 


router.get('/:userId', authenticate, getUserById);
router.post('/:userId/saved-posts', authenticate, savePost);
router.delete('/:userId/saved-posts/:postId', authenticate, unsavePost);

module.exports = router;
