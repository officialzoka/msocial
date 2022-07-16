const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.error('Access Denied', {}, 401);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded;
        next();
    } catch (ex) {
        return res.error('Unexpected Error');
    }
};
