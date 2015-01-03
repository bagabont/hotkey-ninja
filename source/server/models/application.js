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

Application = mongoose.model('applications', ApplicationSchema);

Application.remove({}, function() {

    Application.create({
        name: "notepad++",
        shortcuts: [
            {
                combination: "ctrl+a",
                action: "Select all"
            },
            {
                combination: "ctrl+v",
                action: "Paste text"
            },
            {
                combination: "ctrl+c",
                action: "Aasd"
            }
        ]
    });
});

module.exports = Application;
