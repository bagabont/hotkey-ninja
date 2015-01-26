var router = require('express').Router(),
    fs = require('fs'),
    Application = require('../models/application');

module.exports = function (passport) {
    router.route('/admin')
        .get(passport.authenticate('basic', {session: false}), function (req, res, next) {
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
                res.render('./admin/admin', {
                    title: 'Admin Panel',
                    applications: applications
                });
            });
        });

    router.route('/admin/edit/:id')
        .get(passport.authenticate('basic', {session: false}), function (req, res, next) {
            Application.findOne({_id: req.params.id}, function (err, model) {
                if (err) {
                    return next(err);
                }
                var app = {
                    id: model.id,
                    name: model.name,
                    platform: model.platform,
                    shortcuts: model.shortcuts
                };
                res.render('./admin/edit', {
                    title: 'Edit Application',
                    application: app
                });
            });
        });

    router.route('/admin/upload')
        .all(passport.authenticate('basic', {session: false}))
        .post(function (req, res, next) {
            try {
                var data = JSON.parse(req.files.app_shortcuts.buffer);
                Application.create(data, function (err, data) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.redirect('back')
                });
            }
            catch (ex) {
                res.status(400).send(ex);
            }
        });
    return router;
};
