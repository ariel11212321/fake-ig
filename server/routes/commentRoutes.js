const router = require('express').Router();
const commentController = require('../controllers/commentController');

router.post('/comment', commentController.createComment);
router.get('/comment/:id', commentController.getComment);


module.exports = router;

