const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const authenticate = require('../middleware/auth');
const postController = require('../controllers/postController');


router.get('/posts', authenticate, postController.getPosts);
router.post('/post', authenticate, upload.single('image'), postController.createPost);
router.post('/post/:id',authenticate, upload.single('image'), postController.updatePost);
router.get('/post/:userId/posts', authenticate, postController.getUserPosts);
router.get('/post/:id', authenticate, postController.getPostById);
router.delete('/post/:id', authenticate, postController.deletePost);



module.exports = router;
