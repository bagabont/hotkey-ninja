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

Application.remove({}, function(err) {
    console.log('collection removed');
});

Application.create({
    "name": "notepad++",
    "platform": "windows",
    "shortcuts": [
        {
            "combination": "ctrl+a",
            "action": "Select all"
        },
        {
            "combination": "ctrl+v",
            "action": "Paste text"
        },
        {
            "combination": "ctrl+c",
            "action": "Copy text"
        },
        {
            "combination": "ctrl+w",
            "action": "Close current document"
        },
        {
            "combination": "ctrl+a",
            "action": "Select all"
        },
        {
            "combination": "ctrl+v",
            "action": "Paste text"
        },
        {
            "combination": "ctrl+c",
            "action": "Copy text"
        },
        {
            "combination": "ctrl+w",
            "action": "Close current document"
        },
        {
            "combination": "ctrl+a",
            "action": "Select all"
        },
        {
            "combination": "ctrl+v",
            "action": "Paste text"
        },
        {
            "combination": "ctrl+c",
            "action": "Copy text"
        },
        {
            "combination": "ctrl+w",
            "action": "Close current document"
        }
    ]
});

module.exports = Application;
