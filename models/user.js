const mongoose = require('mongoose');
const Methods = require('../methods/user.method');
require('dotenv').config();

const User = new mongoose.Schema(
    {
        fname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            allowNull: false,
        },
        lname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            allowNull: false,
        },
        full_name: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 255,
        },
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            allowNull: false,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
            allowNull: false,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255,
            allowNull: false,
            select: false,
        },
        isEmailActivated: {
            type: Boolean,
            default: false,
            required: false,
        },
        isPhoneActivated: {
            type: Boolean,
            default: false,
            required: false,
        },
        token: {
            type: String,
            required: false,
            select: false,
        },
        otp: {
            type: Number,
            required: false,
            select: false,
        },
        avatar: {
            type: String,
            required: false,
            allowNull: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        blocked: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        notifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Notification',
            },
        ],
    },
    { timestamps: true, versionKey: false },
);

// user search index
User.index({ fname: 'text', lname: 'text', username: 'text', email: 'text' });

// methods
Methods(User);

module.exports = mongoose.model('User', User);
