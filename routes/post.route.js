const router = require('express').Router();
const PostController = require('../controllers/post.controller');

router.get('/:id', PostController.GetPost);
router.post('/create', PostController.CreatePost);
router.put('/update/:id', PostController.UpdatePost);
router.delete('/delete/:id', PostController.DeletePost);
router.post('/like/:id', PostController.LikePost);
router.post('/unlike/:id', PostController.UnlikePost);

module.exports = router;
