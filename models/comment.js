const mongoose = require('mongoose');

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
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true, versionKey: false },
);
module.exports = mongoose.model('Comment', Comment);
