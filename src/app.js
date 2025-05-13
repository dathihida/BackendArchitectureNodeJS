require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();


// console.log(`Process::`, process.env);

// init middleware
// +init morgan
app.use(morgan('dev'));
// app.use(morgan('combined'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));

// +init helmet
app.use(helmet());
// +init compression
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init database
require('./dbs/init.mongodb.js');
// check connect mongodb
const { checkOverLoad } = require('./helpers/check.connect.js');
checkOverLoad();
// init routes

app.use('/', require('./routers/index.js'));

//init handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error',
    })
});


module.exports = app;