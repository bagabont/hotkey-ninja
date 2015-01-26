var express = require('express'),
    User = require('../models/user'),
    multer = require('multer'),
    bodyParser = require('body-parser');

module.exports = function (config, app, passport) {
    //Initialize passport
    app.use(passport.initialize());

    // Create default administrator account, if it does not exist
    (function createAdminAccount() {
        User.findOne({username: 'admin'}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                return;
            }

            user = new User({
                username: 'admin',
                password: 'admin'
            });
            user.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log('Admin account created!');
            });
        });
    })();

    app.disable('x-powered-by');
    app.disable('etag');

    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');

    // configure public directory
    app.use(express.static(config.rootPath + '/public'));

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    })); 

    // configure file uploader
    app.use(multer({inMemory: true}));

    // app.use(express.json());       // to support JSON-encoded bodies
    // app.use(express.urlencoded());

    // setup routers
    app.use('/api/v1/applications', require('../routes/applications')(passport));

    // app.use(function (req, res, next) {
    // res.setHeader('Content-Type', 'text/plain')
    // res.end(JSON.stringify(req.body, null, 2))
    // next();
    // })

    app.use('/', require('../routes/dojo')());
    app.use('/', require('../routes/admin')(passport));
    app.get('/', function (req, res, next) {
        res.render('index');
        res.end(JSON.stringify(req.body, null, 2));
        next();
    });
};
