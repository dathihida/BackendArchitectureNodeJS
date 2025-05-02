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

//init database
require('./dbs/init.mongodb.js');
// check connect mongodb
const { checkOverLoad } = require('./helpers/check.connect.js');
checkOverLoad();
// init routes
app.get('/', (req, res, next) => {
    const strCompression = 'Hello Compression'
    return res.status(200).json({
        message: 'Hello World!',
        metadata: strCompression.repeat(1000),
    });
});

//inter handling errors


module.exports = app;