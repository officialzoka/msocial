const Post = require('../models/post');
const Comment = require('../models/comment');
const Validation = require('../middlewares/validation');
const AuthCheck = require('../middlewares/auth');

module.exports.CreateComment = [
    Validation.PostValidation,
    AuthCheck,
    async (req, res) => {
        const comment = new Comment({
            text: req.body.text,
            post: req.params.id,
            author: req.userId,
        });
        await comment.save();
        return res
            .status(201)
            .json({ message: 'Comment created successfully' });
    },
];
module.exports.UpdateComment = [
    Validation.PostValidation,
    AuthCheck,
    async (req, res) => {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ message: 'Comment not found' });
        if (comment.author.toString() !== req.userId)
            return res.status(401).json({
                message: 'You are not authorized to update this comment',
            });
        comment.text = req.body.text;
        await comment.save();
        return res
            .status(200)
            .json({ message: 'Comment updated successfully' });
    },
];
module.exports.DeleteComment = [
    AuthCheck,
    async (req, res) => {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ message: 'Comment not found' });
        if (comment.author.toString() !== req.userId)
            return res.status(401).json({
                message: 'You are not authorized to delete this comment',
            });
        await comment.remove();
        return res
            .status(200)
            .json({ message: 'Comment deleted successfully' });
    },
];
