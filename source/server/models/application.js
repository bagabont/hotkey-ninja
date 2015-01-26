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
            "combination": "ctrl+z",
            "action": "Undo"
        },
        {
            "combination": "ctrl+y",
            "action": "Redo"
        },
        {
            "combination": "ctrl+f",
            "action": "Launch Find Dialog"
        },
        {
            "combination": "ctrl+h",
            "action": "Launch Find / Replace Dialog"
        },
        {
            "combination": "ctrl+d",
            "action": "Duplicate Current Line"
        },
        {
            "combination": "ctrl+l",
            "action": "Delete Current Line"
        },
        {
            "combination": "ctrl+shift+f",
            "action": "Find in Files"
        },
        {
            "combination": "ctrl+shift-i",
            "action": "Incremental Search"
        },
        {
            "combination": "ctrl+s",
            "action": "Save File"
        },
        {
            "combination": "ctrl+alt+s",
            "action": "Save As"
        },
        {
            "combination": "ctrl+shift-s",
            "action": "Save All"
        },
        {
            "combination": "ctrl+o",
            "action": "Open File"
        },
        {
            "combination": "ctrl+n",
            "action": "New file"
        },
        {
            "combination": "ctrl+g",
            "action": "Launch GoToLine Dialog"
        },
        {
            "combination": "ctrl+shift+up",
            "action": "Move Current Line Up"
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
            "combination": "ctrl+z",
            "action": "Undo"
        },
        {
            "combination": "ctrl+y",
            "action": "Redo"
        }
    ]
});

module.exports = Application;
