(function () {
    var Dojo = {
        init: function () {
            var self = this;
            var counter = 0;

            var k = new Kibo();
            var events = [];
            var nameMap = {
                "Control": "ctrl",
                "Alt": "alt",
                "Shift": "shift",
                "Meta": "ctrl"
            };
            k.down("any", function (e) {
                events.push(e);
            });
            k.up("any", function (e) {
                if (events.length > 0) {
                    var combination = _.map(events, function (event) {
                        keyName = event.key;
                        if(_.contains(_.keys(nameMap), keyName)) {
                            keyName = nameMap[keyName];
                        }
                        return keyName;
                    });

                    // Submit answer
                    socket.emit('answer', {
                        answer: combination.join("+"),
                        user: self.name
                    });
                }
                events = [];
            });

            // connect to the socket
            var socket = App.socket;
            var isInitiator = App.isInitiator;
            var isChannelReady = App.isChannelReady;
            this.socket = socket;
            // on connection to server get the id of person's room
            socket.on('connect', function () {
                console.log("connect");
                socket.emit('load', self.getData().id);
            });

            // receive the names of all people in the game room
            socket.on('loaded', function (data) {
                console.log("loaded");
                if (data.players === 0) {
                    App.isInitiator = true;
                    $(".invite").show();
                    socket.emit('join', self.getData());
                }
                if (data.players === 1) {
                    App.isChannelReady = true;
                    $(".login").show();
                    socket.emit('join', self.getData());
                }
                console.log(data.players);
            });

            socket.on('jointed', function (room) {
                console.log('This peer has joined room ' + room);
                App.isChannelReady = true;
            });

            socket.on('start', function (data) {
                var opponent = "";
                var name = App.getName();
                self.name = name;
                var mode = 0;
                console.log("start");
                if (data.id == self.getData().id) {
                    total = data.total;

                    if (name == data.users[0]) {
                        opponent = data.users[1];
                    }
                    else {
                        opponent = data.users[0];
                        mode = 1;
                    }

                }
                $(".login").hide();
                $(".invite").hide();
                $(".bar").show();
                $(".player_1 .player__name").text(name);
                $(".player_2 .player__name").text(opponent);
                Fight.init(mode);
            });

            socket.on('query', function (data) {
                console.log(data);
                self.addQuestion(data.query);
            });

            socket.on('game over', function (data) {
            });

            socket.on('leave', function (data) {
                console.log(data.user + ' left.');
            });

            socket.on('progress', function (data) {
                if (data.user === self.name && data.isCorrect) {
                    Fight.kick();
                } else {
                    Fight.opponentKick();
                }
            });

            socket.on('full', function (data) {
                console.log(data);
                console.log('Game is full.');
            });
            this.initEvents();





        },
        initEvents: function () {
            var self = this;
            $(".login form").on("submit", function (e) {
                App.saveName($(".user-name").val());
                self.socket.emit('join', self.getData());
                return false;
            });

        },
        getData: function () {
            var name = "userName";
            var parts = location.pathname.split("/");
            return {
                user: App.getName(),
                id: parts[2] + "/" + parts[3]
            };
        },
        addQuestion: function (question) {
            var self = this;
            var $holder = $(".questions");
            $holder.empty();
            var $el = $(".question").clone();
            $el.find(".question__title").text(question);
            $holder.append($el.show());
            $el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                $el.remove();
                self.socket.emit('answer', {
                    answer: "",
                    user: self.name
                });
            });
        }
    };

    $(Dojo.init.bind(Dojo));
})();
