var router = require('express').Router();

module.exports = function () {

    router.route('/dojo/create')
        .post(function (req, res, next) {
            // Generate unique id for the room
            var id = Math.round((Math.random() * 1000000));

            var app = req.body.selectedApplication;

            // Redirect to the room
            res.redirect('/dojo/' + app + '/' + id);
        });

    router.route('/dojo/:app/:id')
        .get(function (req, res, next) {
            res.render("dojo", {
                userName: req.query.user1,
                appLink: req.headers.host + req.url
            });
        });

    return router;
};
