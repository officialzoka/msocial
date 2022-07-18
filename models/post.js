const mongoose = require('mongoose');
const Methods = require('../methods/post.method');

const Post = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 320,
        },
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Comment',
            },
        ],
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true, versionKey: false },
);

// post search index
Post.index({ text: 'text' });
Methods(Post);
module.exports = mongoose.model('Post', Post);
