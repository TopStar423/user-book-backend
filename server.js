const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const server = express();

require('dotenv').config();

require('./config/connection');
require('./config/passport')(passport);

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

const port = process.env.PORT || 8000;

require('./routes')(server);

server.listen(port, () => {
    console.log('Server is listening PORT ', port);
})
