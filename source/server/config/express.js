var express = require('express');

module.exports = function (config, app) {
    app.disable('x-powered-by');
    app.disable('etag');
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');

    // configure public directory
    app.use(express.static(config.rootPath + '/public'));

    // setup routers
    app.use('/api/v1/applications', require('../routes/applications')());

    app.use('/', require('../routes/dojo')());
    app.get('/', function (req, res, next) {
        res.render('index');
    });
};