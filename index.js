const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParer = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const AuthRoutes = require('./routes/auth.route');

mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log('Connected to MongoDB');
    },
);

const app = express();
app.use(function (req, res, next) {
    res.success = function (msg = '', data = {}, status = 200) {
        return res.status(status).json({
            status: 'success',
            message: msg,
            data,
        });
    };
    res.error = function (msg = '', error = {}, status = 400) {
        return res.status(status).json({
            status: 'error',
            message: msg,
            error,
        });
    };
    next();
});
app.use(morgan('tiny'));
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', AuthRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
