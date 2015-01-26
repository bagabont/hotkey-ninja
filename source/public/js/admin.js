(function () {
    var EditableTable = {
        shortcuts: [],
        getShortcuts: function(callback) {
            var self = this;
            $table = $(".table_application");
            var application = $table.data("application");
            var url = "/api/v1/applications/" + application.id;

            $.get(url, function(result) {
                self.shortcuts = _.map(result.shortcuts, function(row){
                    console.log(row);
                    return {
                        id: row._id,
                        action: ko.observable(row.action),
                        combination: ko.observable(row.combination),
                        update: self.updateRow,
                        remove: self.removeRow
                    }
                });
                callback();
            });
        },
        updateRow: function() {
            
        },
        removeRow: function() {
            console.log(this);
            var self = this;
            var url = "/api/v1/applications/delete/" + this.id
            $.post(url, function( data ) {
                console.log(data);
            });
        }
    };

    $(function() {
        EditableTable.getShortcuts(function() {
            console.log(EditableTable);
            ko.applyBindings(EditableTable);
        });
    });

})();