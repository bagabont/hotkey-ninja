var router = require('express').Router();

module.exports = function () {
    router.route('/:app/create')
        .post(function (req, res, next) {
            // Generate unique id for the room
            var id = Math.round((Math.random() * 1000000));
            var app = req.params.app;

            // Redirect to the room
            res.redirect('/' + app + '/' + id);
        });

    router.route('/:app/:id')
        .get(function (req, res, next) {
            res.render('dojo');
        });

    return router;
};