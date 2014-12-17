var mongoose = require('mongoose');

module.exports = function (config) {
    // connect to database
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.once('open', function (err) {
        if (err) {
            console.log('Database connection could not be open: ' + err);
            return;
        }
        console.log('Database up and running...');
    });

    // error handler
    db.on('error', function (err) {
        console.log('Database error: ' + err);
    });
};
