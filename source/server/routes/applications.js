var router = require('express').Router(),
    mongoose = require('mongoose'),
    Application = require('../models/application'),
    fs = require('fs');;

module.exports = function (passport) {

    router.route('/')
        .get(function (req, res, next) {
            Application.find({}, function (err, models) {
                if (err) {
                    return next(err);
                }
                var applications = [];
                for (var i = 0; i < models.length; i++) {
                    var app = {
                        id: models[i].id,
                        name: models[i].name,
                        platform: models[i].platform,
                        shortcuts: models[i].shortcuts
                    };
                    applications.push(app);
                }
                res.send(applications);
            });
        });

    router.param('id', function (req, res, next, id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send();
        }
        var query = {
            _id: id
        };
        Application.findOne(query, function (err, model) {
            if (err) {
                return next(err)
            }
            req.app = model;
            next();
        });
    });

    router.route('/:id')
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
        .delete(passport.authenticate('basic', {session: false}), function (req, res, next) {
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
        }
    );

    router.route('/delete')
        .post(passport.authenticate('basic', {session: false}), function (req, res, next) {
            var app = req.app;
            if (!app) {
                return res.status(404).send();
            }
            console.log(app.shortcuts);
            return res.status(200).send();
            // Application.remove(req.app, function (err) {
            //     if (err) {
            //         return next(err);
            //     }
            //     return res.status(200).send();
            // });
        }
    );

    router.route('/create')
        .all(passport.authenticate('basic', {session: false}))
        .post(function (req, res, next) {
            Application.create(obj, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(201).send();
            });
        });

    return router;
};
