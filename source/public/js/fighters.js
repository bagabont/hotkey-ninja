(function () {
    Fight = {
        init: function (mode, callback) {
            var self = this;
            var fighters = [{name: 'subzero'}, {name: 'kano'}];
            if (mode === 1) {
                fighters = fighters.reverse();
            }
            var options = {
                arena: {
                    container: document.getElementById('arena'),
                    arena: mk.arenas.types.THRONE_ROOM,
                    width: document.body.clientWidth,
                    height: $(window).height()
                },
                fighters: fighters,
                callbacks: {
                    attack: function (f, o, l) {
                        console.log(o.getName());
                        if (o.getName() === fighters[0].name) {
                            self.setLife($('.player_1'), o.getLife());
                        } else {
                            self.setLife($('.player_2'), o.getLife());
                        }
                    },
                    "game-end": function (f) {
                        App.gameOver = true;
                        $(".bar, .questions").hide();
                        if(f.getName() == fighters[1].name) {
                            $(".victory").show();
                            console.log("You win!");
                        } else {
                            $(".lost").show();
                            console.log("looser");
                        }
                    }

                },
                gameType: 'basic'
            };
            mk.start(options).ready(function () {
                if(callback) callback();
            });
        },

        setLife: function (container, life) {
            container.find(".player__health-inner").width(life + "%");
        },

        walkToCenter: function() {
            console.log("once");
            mk.game._moveFighter(mk.game.fighters[0], "walking");
            mk.game._moveFighter(mk.game.fighters[1], "walking-backward");
            setTimeout(function() {
                mk.game._moveFighter(mk.game.fighters[0], "stand");
                mk.game._moveFighter(mk.game.fighters[1], "stand");
            }, 800);
        },

        first: true,

        kick: function () {
            if (this.first) {
                this.walkToCenter();
                this.first = false;
            } else {
                Sounds.playKickSound();
                mk.game._moveFighter(mk.game.fighters[0], _.sample(this.moves).toLowerCase().replace(/_/g, "-"));
            }
        },
        opponentKick: function() {
            if (this.first) {
                this.walkToCenter();
                this.first = false;
            } else {
                mk.game._moveFighter(mk.game.fighters[1], _.sample(this.moves).toLowerCase().replace(/_/g, "-"));
            }
        },

        moves: [
            "HIGH_KICK",
            "LOW_KICK",
            "HIGH_PUNCH",
            "LOW_PUNCH",
        ]
    };
})();
