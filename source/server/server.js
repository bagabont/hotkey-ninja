var http = require('http'),
    passport = require('passport'),
    express = require('express');

// get configuration
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var app = express();

// create an HTTP service.
var server = http.createServer(app);

// configure server
require('./config/mongoose')(config);
require('./config/passport')(passport);
require('./config/express')(config, app, passport);
require('./config/socket')(server);

module.exports = server;