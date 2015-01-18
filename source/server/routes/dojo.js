var router = require('express').Router();

module.exports = function () {
    router.route('/dojo/:app/create')
        .post(function (req, res, next) {
            // Generate unique id for the room
            //var id = Math.round((Math.random() * 1000000));
            var id = 1111;
            var app = req.params.app;

            var user = req.body.player1;
            // Redirect to the room
            res.redirect('/dojo/' + app + '/' + id + '?userName=' + user);
        });

    router.route('/dojo/:app/:id')
        .get(function (req, res, next) {
            user1 = req.query.user1;
            host = req.headers.host;
            linkTail = req.url;
            appLink = host + linkTail;
            res.render("dojo", {
                userName: user1,
                appLink: appLink
            });
        });

    return router;
};
