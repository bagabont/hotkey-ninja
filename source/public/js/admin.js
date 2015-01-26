(function () {
    var EditableTable = {
        shortcuts: [],
        getShortcuts: function(callback) {
            var self = this;
            $table = $(".table_application");
            var application = $table.data("application");
            var url = "/api/v1/applications/" + application.id;

            $.get(url, function(result) {
                self.shortcuts = ko.observableArray(_.map(result.shortcuts, function(row){
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
        updateApp: function() {
            var self = this;
            $table = $(".table_application");
            var application = $table.data("application");
            var url = "/api/v1/applications/" + application.id;
            var onlyShortcuts = self.getRawShortcuts(EditableTable.shortcuts());
            $.post(url, {onlyShortcuts: onlyShortcuts}, function(){
                
            });
            // $.ajax({
            //     url: url,
            //     type: "POST",
            //     dataType: "json",
            //     data: {onlyShortcuts: onlyShortcuts},

            //   });
        },
        removeRow: function() {
            EditableTable.shortcuts.remove(this);
        },
        addRow: function(){
            var self = this;
            self.shortcuts.push({
                action: "",
                combination: "",
                removeRow: self.removeRow,
            });
        },
        getRawShortcuts: function (data){
            return _.map(data, function (shortcut){
                return {
                    _id: shortcut._id,
                    action: shortcut.action,
                    combination: shortcut.combination,
                };
            });
        }
    };

    $(function() {
        EditableTable.getShortcuts(function() {
            ko.applyBindings(EditableTable);
        });
    });

})();