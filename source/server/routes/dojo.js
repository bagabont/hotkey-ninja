var router = require('express').Router();

module.exports = function () {

    router.route('/dojo/create')
        .post(function (req, res, next) {
            // Generate unique id for the room
            var roomId = Math.round((Math.random() * 1000000));

            var params = req.body.selectedApplication.split('/');
            var appName = params[0];
            var appId = params[1];

            res.appName = appName;
            // Redirect to the room
            res.redirect('/dojo/' + appId + '/' + roomId + '?appName=' + appName);
        });

    router.route('/dojo/:app/:id')
        .get(function (req, res, next) {
            res.render("dojo", {
                userName: req.query.user1,
                appName: req.query.appName,
                appLink: req.headers.host + req.url
            });
        });

    return router;
};
