const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const cookieParer = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const AuthRoutes = require('./routes/auth.route');
const UserRoutes = require('./routes/user.route');
const PostRoutes = require('./routes/post.route');

mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log('Connected to DB');
    },
);

const app = express();
app.use(
    cors(
        { origin: 'http://localhost:3000', credentials: true },
        { origin: 'https://msocial-api.herokuapp.com', credentials: true },
    ),
);
app.use(morgan('tiny'));
app.use(helmet());
app.use(xssClean());
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParer());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/post', PostRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
