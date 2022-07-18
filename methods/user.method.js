const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = function (schema) {
    schema.pre('save', function (next) {
        if (this.isNew) {
            if (!this.isModified('full_name')) {
                this.full_name = `${this.fname} ${this.lname}`;
            }
        }
        next();
    });
    schema.methods.getUser = function () {
        return {
            id: this._id,
            email: this.email,
            full_name: this.full_name,
            username: this.username,
            fname: this.fname,
            lname: this.lname,
            isEmailVerified: this.isEmailVerified,
            isPhoneVerified: this.isPhoneVerified,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    };

    schema.methods.generateJwtToken = function () {
        const user = this.getUser();
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return token;
    };
    schema.methods.generateEmailActivationToken = function () {
        const token = crypto.randomBytes(20).toString('hex');
        this.token = token;
        this.save();
        return `${process.env.LOCAL_URL}/auth/verify/${this.token}/${this._id}`;
    };
    schema.methods.activateEmail = function () {
        this.isEmailVerified = true;
        this.token = null;
        return this.save();
    };
    schema.methods.follow = function (userId) {
        const user = mongoose.model('User').findById(userId);
        if (user.status === 'public') {
            user.followers.addToSet(this._id);
            this.following.addToSet(userId);
        } else {
            user.waitingToApproved.addToSet(this._id);
            this.sentedRequests.addToSet(userId);
        }
        user.save();
        return this.save();
    };
    schema.methods.unfollow = function (userId) {
        this.following.pull(userId);
        const user = mongoose.model('User').findById(userId);
        user.followers.pull(this._id);
        user.save();
        return this.save();
    };
    schema.methods.approveFollow = function (userId) {
        const user = mongoose.model('User').findById(userId);
        this.followers.addToSet(userId);
        this.waitingToApproved.pull(userId);
        user.sentedRequests.pull(this._id);
        user.following.addToSet(this._id);
        user.save();
        return this.save();
    };
    schema.methods.rejectFollow = function (userId) {
        const user = mongoose.model('User').findById(userId);
        this.waitingToApproved.pull(userId);
        user.sentedRequests.pull(this._id);
        user.save();
        return this.save();
    };
};
