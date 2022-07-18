const mongoose = require('mongoose');

module.exports = function (schema) {
    schema.pre('save', function (next) {
        if (this.isNew) {
            const post = mongoose.model('Post').findById(this.post);
            post.comments.addToSet(this._id);
            post.save();
        }
        next();
    });
    schema.pre('remove', function (next) {
        const post = mongoose.model('Post').findById(this.post);
        post.comments.pull(this._id);
        post.save();
        next();
    });
};
