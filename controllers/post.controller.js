const Post = require('../models/post');
const Comment = require('../models/comment');
const Validation = require('../middlewares/validation');
const AuthCheck = require('../middlewares/auth');

module.exports.CreatePost = [
    Validation.PostValidation,
    AuthCheck,
    async (req, res) => {
        const post = new Post({
            text: req.body.text,
            author: req.userId,
        });
        await post.save();
        return res.status(201).json({ message: 'Post created successfully' });
    },
];
module.exports.UpdatePost = [
    Validation.PostValidation,
    AuthCheck,
    async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.userId)
            return res.status(401).json({
                message: 'You are not authorized to update this post',
            });
        await post.updatePost(req.body.text);
        return res.status(200).json({ message: 'Post updated successfully' });
    },
];
module.exports.DeletePost = [
    AuthCheck,
    async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.userId)
            return res.status(401).json({
                message: 'You are not authorized to delete this post',
            });
        await post.removePost();
        return res.status(200).json({ message: 'Post deleted successfully' });
    },
];
module.exports.LikePost = [
    AuthCheck,
    async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.likes.includes(req.userId))
            return res
                .status(400)
                .json({ message: 'You already liked this post' });
        await post.like(req.userId);
        return res.status(200).json({ message: 'Post liked successfully' });
    },
];
module.exports.UnlikePost = [
    AuthCheck,
    async (req, res) => {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (!post.likes.includes(req.userId))
            return res
                .status(400)
                .json({ message: 'You have not liked this post' });
        await post.unlike(req.userId);
        return res.status(200).json({ message: 'Post unliked successfully' });
    },
];
module.exports.GetPost = [
    AuthCheck,
    async (req, res) => {
        const post = await Post.findById(req.params.id).populate('author');
        await post.getComments();
        if (!post) return res.status(404).json({ message: 'Post not found' });
        return res.status(200).json(post);
    },
];
