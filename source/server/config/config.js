var path = require('path');

var rootPath = path.normalize(__dirname + '../../../');
var mongoUser = process.env.MONGO_USER || "root";
var mongoPass = process.env.MONGO_PASS || "";

//var connectionString = 'mongodb://' + mongoUser + ':' + mongoPass + '@ds063870.mongolab.com:63870/hotkey-ninja';
var connectionString = 'mongodb://localhost:27017/hotkey-ninja';

module.exports = {
    development: {
        rootPath: rootPath,
        db: connectionString
    },
    production: {
        rootPath: rootPath,
        db: connectionString
    }
};
