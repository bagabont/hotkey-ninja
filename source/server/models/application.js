var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShortcutSchema = new Schema({
    combination: {type: String},
    action: {type: String}
});

var ApplicationSchema = new Schema({
    name: {type: String},
    shortcuts: [ShortcutSchema]
});

module.exports = mongoose.model('applications', ApplicationSchema);