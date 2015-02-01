(function () {
    var EditableTable = {
        name: '',
        shortcuts: [],

        getShortcuts: function (callback) {
            var self = this;
            $table = $(".table_application");
            var application = $table.data("application");
            var url = "/api/v1/applications/" + application.id;

            $.get(url, function (result) {
                self.name = ko.observable(result.name),
                    self.shortcuts = ko.observableArray(_.map(result.shortcuts, function (row) {
                        return {
                            _id: row._id,
                            action: row.action,
                            combination: row.combination,
                            updateApp: self.updateApp,
                            removeRow: self.removeRow,
                            addRow: self.addRow
                        }
                    }));
                callback();
            });
        },
        updateApp: function () {
            var self = this;
            $table = $(".table_application");
            var application = $table.data("application");
            var url = "/api/v1/applications/" + application.id;
            var shortcuts = self.getRawShortcuts(EditableTable.shortcuts());

            $.post(url, {
                name: EditableTable.name,
                shortcuts: shortcuts
            }, function () {
                $(".alert-success").show().fadeOut(2500);
            });
        },
        removeRow: function () {
            EditableTable.shortcuts.remove(this);
        },
        addRow: function () {
            var self = this;
            self.shortcuts.push({
                action: "",
                combination: "",
                removeRow: self.removeRow
            });
        },
        getRawShortcuts: function (data) {
            return _.map(data, function (shortcut) {
                return {
                    _id: shortcut._id,
                    action: shortcut.action,
                    combination: shortcut.combination
                };
            });
        }
    };

    $(function () {
        EditableTable.getShortcuts(function () {
            ko.applyBindings(EditableTable);
        });
    });
})();