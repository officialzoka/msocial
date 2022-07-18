const AuthCheck = require('../middlewares/auth');
const User = require('../models/user');

// Search users by query
module.exports.SearchUsers = [
    AuthCheck,
    async (req, res) => {
        const { query } = req.params.query;
        const currentUser = await User.findById(req.userId);
        let users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { full_name: { $regex: query, $options: 'i' } },
                { fname: { $regex: query, $options: 'i' } },
                { lname: { $regex: query, $options: 'i' } },
            ],
        });
        users = users.filter((user) => user._id !== req.userId);
        users = user.filter(
            (user) => currentUser.blocked.includes(user._id) === false,
        );
        users = users.filter(
            (user) => user.blocked.includes(req.userId) === false,
        );
        return res.status(200).json(users);
    },
];
module.export.FollowUser = [
    AuthCheck,
    async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: 'User id is required',
            });
        }
        if (userId === req.userId) {
            return res.status(400).json({
                message: 'You can not follow yourself',
            });
        }
        const currentUser = await User.findById(req.userId);
        await currentUser.follow(userId);
        return res.status(200).json({ message: 'User followed' });
    },
];
module.export.UnfollowUser = [
    AuthCheck,
    async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: 'User id is required',
            });
        }
        if (userId === req.userId) {
            return res.status(400).json({
                message: 'You can not unfollow yourself',
            });
        }
        const currentUser = await User.findById(req.userId);
        await currentUser.unfollow(userId);
        return res.status(200).json({ message: 'User unfollowed' });
    },
];
module.exports.ApproveUser = [
    AuthCheck,
    async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: 'User id is required',
            });
        }
        if (userId === req.userId) {
            return res.status(400).json({
                message: 'You can not approve yourself',
            });
        }
        const currentUser = await User.findById(req.userId);
        await currentUser.approveFollow(userId);
        return res.status(200).json({ message: 'User approved' });
    },
];
module.exports.RejectUser = [
    AuthCheck,
    async (req, res) => {
        const { userId } = req.params;
        if (!userId) {
            return res.status(404).json({
                message: 'User id is required',
            });
        }
        if (userId === req.userId) {
            return res.status(400).json({
                message: 'You can not reject yourself',
            });
        }
        const currentUser = await User.findById(req.userId);
        await currentUser.rejectFollow(userId);
        return res.status(200).json({ message: 'User rejected' });
    },
];
