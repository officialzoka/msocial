const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

module.exports = function (schema) {
    schema.methods.generateJwtToken = function () {
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
        return token;
    };
    schema.methods.generateEmailActivationToken = function () {
        const token = crypto.randomBytes(20).toString('hex');
        this.token = token;
        this.save();
        return `${process.env.LOCAL_URL}/auth/verify/${this.token}/${this._id}`;
    };
    schema.methods.activateEmail = function () {
        this.isEmailActivated = true;
        this.token = null;
        return this.save();
    };
};
