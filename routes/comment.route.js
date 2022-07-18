const router = require('express').Router();
const CommentController = require('../controllers/comment.controller');

router.post('/create/:id', CommentController.CreateComment);
router.put('/update/:id', CommentController.UpdateComment);
router.delete('/delete/:id', CommentController.DeleteComment);

module.exports = router;
