var router = require('express').Router();

module.exports = function () {
    router.route('/dojo/:app/create')
        .post(function (req, res, next) {
            // Generate unique id for the room
            //var id = Math.round((Math.random() * 1000000));
            var id = 1111;
            var app = req.params.app;

            // Redirect to the room
            res.redirect('/dojo/' + app + '/' + id);
        });

    router.route('/dojo/:app/:id')
        .get(function (req, res, next) {
            res.render('dojo');
        });

    return router;
};