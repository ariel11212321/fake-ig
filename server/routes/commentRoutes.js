const router = require('express').Router();
const commentController = require('../controllers/commentController');


router.post('/', commentController.createComment);
router.get('/:id', commentController.getComment);
router.post('/:id/:userId/like', commentController.likeComment);
router.delete('/:id/:userId/like', commentController.unlikeComment);

module.exports = router;