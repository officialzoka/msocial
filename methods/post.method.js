const mongoose = require('mongoose');

module.exports = function (schema) {
    schema.pre('save', function (next) {
        if (this.isNew) {
            const user = mongoose.model('User').findById(this.author);
            user.posts.addToSet(this._id);
            user.save();
        }
        next();
    });
    schema.pre('remove', function (next) {
        const user = mongoose.model('User').findById(this.author);
        user.posts.pull(this._id);
        user.save();
        if (this.comments.length > 0) {
            this.comments.forEach(async (comment) => {
                await mongoose.model('Comment').findById(comment).remove();
            });
        }
        next();
    });
    schema.methods.updatePost = function (text) {
        this.text = text;
        return this.save();
    };
    schema.methods.like = function (userId) {
        this.likes.addToSet(userId);
        return this.save();
    };
    schema.methods.unlike = function (userId) {
        this.likes.pull(userId);
        return this.save();
    };
    schema.methods.getComments = function () {
        this.comments = this.comments.populate('author');
        return this.save();
    };
};
