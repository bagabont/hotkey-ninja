var App = {
    init: function () {
        $(".user-name").val(this.getName());
        this.initEvents();
    },
    saveName: function (name) {
        localStorage.setItem("name", name);
    },
    getName: function () {
        name = "";
        if (localStorage.getItem("name")) {
            name = localStorage.getItem("name");
        }
        return name;
    },
    initEvents: function () {
        var self = this;
        $(".form_get-name").on("submit", function () {
            self.saveName($(".user-name").val());
            return true;
        });
    },
    isIntiator: false,
    isChannelReady: false,
    socket: io.connect('/socket'),
    gameOver: false
};

$(App.init.bind(App));
