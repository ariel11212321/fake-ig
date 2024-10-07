const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const authenticate = require('../middleware/auth');
const postController = require('../controllers/postController');


router.get('/', authenticate, postController.getPosts);
router.post('/', authenticate, upload.single('image'), postController.createPost);
router.put('/:id',authenticate, upload.single('image'), postController.updatePost);
router.get('/:id', authenticate, postController.getPostById);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/:postId/like', authenticate, postController.likePost);
router.post('/:postId/unlike', authenticate, postController.unlikePost);
router.get('/:userId/posts', authenticate, postController.getUserPosts);
router.get('/:userId/savedPosts', authenticate, postController.getUserSavedPosts);






module.exports = router;
