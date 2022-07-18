const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
    schema.methods.generateJwtToken = function () {
        const user = {
            id: this._id,
            email: this.email,
            full_name: this.full_name,
            fname: this.fname,
            lname: this.lname,
            username: this.username,
        };
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
        this.isEmailActivated = true;
        this.token = null;
        return this.save();
    };
};
