const express = require('express');
const connection = require('./config/DatabaseConfig')
const bodyParser = require('body-parser');

const PublicationsRouter = require('./routes/Publication')
const NewsletterRouter = require('./routes/Newsletter')
const userRouter = require('./routes/User')
const authRouter = require('./routes/Auth')


connection.getConnections();

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);
app.use('/api/publications', PublicationsRouter);
app.use('/api/newsletter', NewsletterRouter);
app.use('/api/users', userRouter);



module.exports = app;