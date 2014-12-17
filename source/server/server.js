var http = require('http'),
    express = require('express');

// get configuration
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var app = express();

// create an HTTP service.
var server = http.createServer(app);

// configure server
require('./config/mongoose')(config);
require('./config/express')(config, app);
require('./config/socket')(server);

module.exports = server;