var router = require('express').Router(),
    mongoose = require('mongoose'),
    Shortcut = require('../models/application').Shortcut,
    Application = require('../models/application').Application;

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

    router.route('/create')
        .all(passport.authenticate('basic', {session: false}))
        .post(function (req, res, next) {
            Application.create(req.body, function (err) {
                if (err) {
                    return next(err);
                }
                res.status(201).send();
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
            if (!model) {
                return res.status(404).send();
            }
            req.app = model;
            next();
        });
    });

    router.route('/:id')
        .get(function (req, res, next) {
            var app = req.app;
            // convert the schema object to proper JSON
            res.send({
                name: app.name,
                platform: app.platform,
                shortcuts: app.shortcuts
            });
        })
        .delete(passport.authenticate('basic', {session: false}), function (req, res, next) {
            Application.remove(req.app, function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).send();
            });
        }
    );

    router.route('/:id/shortcuts')
        .get(function (req, res, next) {
            res.send(req.app.shortcuts);
        });

    router.param('sid', function (req, res, next, sid) {
        // find shortcut by id
        var shortcut = req.app.shortcuts.filter(function (e) {
            return e.id === req.params.sid;
        });

        // there must be only one shortcut with this id, if found
        if (shortcut.length === 1) {
            req.shortcut = shortcut[0];
            return next();
        }
        // not found
        return res.status(404).send();
    });

    router.route('/:id/shortcuts/:sid')
        .get(function (req, res, next) {
            return res.send({
                combination: req.shortcut.combination,
                action: req.shortcut.action
            });
        })
        .post(function (req, res, next) {
            var app = req.app;
            var shortcut = new Shortcut(req.body);

            // append new shortcut
            app.shortcuts.push(shortcut);

            // update in DB
            Application.update(app, function (err) {
                if (err) {
                    return next(err);
                }
                // return created
                return res.status(201).send();
            });
        })
        .put(function (req, res, next) {
            var app = req.app;
            // find shortcut
            var shortcut = findById(app.shortcuts, req.params.sid);

            if (!shortcut) {
                return res.status(404).send();
            }

            // update shortcut properties
            shortcut.action = req.body.action;
            shortcut.combination = req.body.combination;

            // update DB
            Application.update(app, function (err) {
                if (err) {
                    return res.status(400).send();
                }
                res.status(204).send();
            });
        })
        .delete(function (req, res, next) {
            var app = req.app;
            var removed = false;

            for (var i = 0; i < app.shortcuts.length; i++) {
                if (app.shortcuts[i].id === req.params.sid) {
                    app.shortcuts.splice(i, 1);
                    removed = true;
                    break;
                }
            }
            if (!removed) {
                return res.status(404).send();
            }

            Application.update(app, function (err) {
                if (err) {
                    next(err);
                }
                return res.status(204).send();
            });
        });

    function findById(source, id) {
        for (var i = 0; i < source.length; i++) {
            if (source[i].id === id) {
                return source[i];
            }
        }
        return null;
    }

    return router;
};
