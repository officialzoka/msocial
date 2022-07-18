const mongoose = require('mongoose');
const Methods = require('../methods/comment.method');

const Comment = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 320,
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true, versionKey: false },
);
Methods(Comment);
module.exports = mongoose.model('Comment', Comment);
