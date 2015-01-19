var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShortcutSchema = new Schema({
    combination: {type: String},
    action: {type: String}
});

var ApplicationSchema = new Schema({
    name: {type: String},
    platform: {type: String},
    shortcuts: [ShortcutSchema]
});

Application = mongoose.model('applications', ApplicationSchema);

module.exports = Application;
