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
        if (!user) return res.error('User not found');

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return res.error('Invalid or incorrect password');

        const token = user.generateJwtToken();
        return res.success('', token);
    },
];
// Register
module.exports.Register = [
    Validation.RegisterValidation,
    async (req, res) => {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.error('User already exists');
        const salt = bcrypt.genSaltSync(16);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user = new User(req.body);
        await user.save();
        return res.success('User created successfully');
    },
];
module.exports.SendEmailActivation = [
    AuthCheck,
    async (req, res) => {
        const user = await User.findById(req.userId).select('+token');
        if (!user) return res.error('User not found');
        const url = await user.generateEmailActivationToken();
        return res.success('Url sent to email', url);
    },
];
module.exports.ActivateUserEmail = async (req, res) => {
    const user = await User.findById(req.params.userId).select('+token');
    if (!user) return res.error('User not found');
    if (!user.token) return res.error('Invalid token');
    if (user.token !== req.params.token) return res.error('Invalid token');
    await user.activateEmail();
    return res.success('Account activated');
};
