const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Validation = require('../middlewares/validation');
const AuthCheck = require('../middlewares/auth');
const User = require('../models/user');
require('dotenv').config();

// Login
module.exports.Login = [
    Validation.LoginValidation,
    async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ message: 'Invalid or incorrect password' });

        const token = await user.generateJwtToken();
        res.cookie('token', token, {
            maxAge: Date.now() + 60 * 60 * 24,
            httpOnly: false,
            sameSite: 'lax',
            secure: true,
        });
        return res.status(200).json(token);
    },
];
// Register
module.exports.Register = [
    Validation.RegisterValidation,
    async (req, res) => {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ message: 'User already exists' });
        user = await User.findOne({ username: req.body.username });
        if (user)
            return res.status(400).json({ message: 'Username already exists' });
        const salt = bcrypt.genSalt(16);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user = new User(req.body);
        await user.save();
        return res.status(200).json({ message: 'User created successfully' });
    },
];
module.exports.SendEmailActivation = [
    AuthCheck,
    async (req, res) => {
        const user = await User.findById(req.userId).select('+token');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const url = await user.generateEmailActivationToken();
        return res.status(200).json(url);
    },
];
module.exports.ActivateUserEmail = async (req, res) => {
    const user = await User.findById(req.params.userId).select('+token');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.token) return res.status(404).json({ message: 'Invalid token' });
    if (user.token !== req.params.token)
        return res.status(400).json({ message: 'Invalid token' });
    await user.activateEmail();
    return res.status(200).json({ messgae: 'Account activated' });
};
