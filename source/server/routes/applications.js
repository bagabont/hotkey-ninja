var router = require('express').Router(),
    Application = require('../models/application');

module.exports = function () {

    router.route('/')
        .get(function (req, res, next) {
            console.log(Application);
            Application.find({}, function (err, models) {
                if (err) {
                    return next(err);
                }
                var applications = [];
                for (var i = 0; i < models.length; i++) {
                    var app = {
                        name: models[i].name,
                        shortcuts: models[i].shortcuts
                    };
                    applications.push(app);
                }
                console.log(applications)
                res.send(applications);
            });
        });

    router.route('/:name')
        .get(function (req, res, next) {
            var appName = req.params.name;
            Application.findOne({name: appName}, function (err, model) {
                if (err) {
                    return next(err);
                }
                if (!model) {
                    return res.status(404).send();
                }
                res.send({
                    name: model.name,
                    shortcuts: model.shortcuts
                });
            });
        });

    return router;
};
