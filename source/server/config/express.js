var express = require('express');
var bodyParser = require('body-parser')

module.exports = function (config, app) {
    app.disable('x-powered-by');
    app.disable('etag');
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');

    // configure public directory
    app.use(express.static(config.rootPath + '/public'));

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // app.use(express.json());       // to support JSON-encoded bodies
    // app.use(express.urlencoded());

    // setup routers
    app.use('/api/v1/applications', require('../routes/applications')());

    // app.use(function (req, res, next) {
    // res.setHeader('Content-Type', 'text/plain')
    // res.end(JSON.stringify(req.body, null, 2))
    // next();
    // })

    app.use('/', require('../routes/dojo')());
    app.get('/', function (req, res, next) {
        res.render('index');
        res.end(JSON.stringify(req.body, null, 2));
        next();
    });
};