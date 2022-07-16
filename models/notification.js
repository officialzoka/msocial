const mongoose = require('mongoose');

const Notification = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'follow', 'reply'],
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false },
);
mongoose.model('Notification', Notification);
