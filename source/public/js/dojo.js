(function () {
    var Dojo = {
        init: function() {
            var self = this;
            var k = new Kibo();
            var ev = [];
            k.down('any', function(e) {
                ev.push(e);
            });
            k.up("any", function(e) {
                if(ev.length > 0) {
                    var r = _.map(ev, function(a) {return a.key});
                    r = r.join(" ");
                    console.log(r);
                }
                ev=[];
            });
            // connect to the socket
            var socket = io.connect('/socket');
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
                    $(".invite").show();
                    socket.emit('join', self.getData());
                }
                if (data.players === 1) {
                    $(".login").show();
                }
                console.log(data.players);
            });

            socket.on('start', function (data) {
                var opponent = "";
                var name = App.getName();
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
                //shortcutAction.text(data.query);
            });

            socket.on('game over', function (data) {
                //queryArea.remove();
                //winnerName.text(data.winner);
            });

            socket.on('leave', function (data) {
                if (roomId == data.room) {
                    console.log(data.user + ' left.');
                }
            });

            socket.on('progress', function (data) {
                if (data.user === username) {
                    playerName.text(username + ' Score: [' + data.score + '/' + total + ']');
                }
                if (data.user === opponent) {
                    opponentName.text(opponent + ' Score: [' + data.score + '/' + total + ']');
                }
            });

            socket.on('full', function (data) {
                console.log(data);
                console.log('Game is full.');
            });
            this.initEvents();
        },
        initEvents: function (){
            var self = this;
            $(".login form").on("submit", function(e) {
                App.saveName($(".user-name").val());
                self.socket.emit('join', self.getData());
                return false;
            });

        },
        getData: function() {
            var name = "userName";
            var parts = location.pathname.split("/");
            return {
                user: App.getName(),
                id: parts[2] + "/" + parts[3]
            };
        },
        addQuestion: function(question) {
            $el = $(".question").clone();
            $el.find(".question__title").text(question);
            $(".page").append($el.show());
            setTimeout(function() {
                $el.remove();
            }, 5000);
        }
    };
    /*
    answerForm.on('submit', function (e) {
        e.preventDefault();

        if (answerInput.val().trim().length) {
            var answer = answerInput.val();

            // Submit answer
            socket.emit('answer', {
                answer: answer,
                user: username
            });
        }

        // Empty the answer text
        answerInput.val("");
    });
    */
    $(Dojo.init.bind(Dojo));
})();
