var router = require('express').Router(),
    Application = require('../models/application');

module.exports = function () {

    router.route('/')
        .get(function (req, res, next) {
            Application.find({}, function (err, models) {
                if (err) {
                    return next(err);
                }
                var applications = [];
                for (var i = 0; i < models.length; i++) {
                    var app = {
                        name: models[i].name,
                        platform: models[i].platform,
                        shortcuts: models[i].shortcuts
                    };
                    applications.push(app);
                }
                res.send(applications);
            });
        });

    router.param('name', function (req, res, next, name) {
        var platform = req.query.platform;
        var query = {
            name: name,
            platform: platform
        };
        Application.findOne(query, function (err, model) {
            if (err) {
                return next(err)
            }
            req.app = model;
            next();
        });
    });

    router.route('/:name')
        .get(function (req, res, next) {
            var app = req.app;
            if (!app) {
                return res.status(404).send();
            }
            res.send({
                name: app.name,
                platform: app.platform,
                shortcuts: app.shortcuts
            });
        })
        .post(function (req, res, next) {
            Application.create(req.body, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(201).send();
            });
        })
        .delete(function (req, res, next) {
            var app = req.app;
            if (!app) {
                return res.status(404).send();
            }

            Application.remove(req.app, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send();
            });
        });

    return router;
};
