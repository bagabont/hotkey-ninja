(function () {
    Fight = {
        init: function (mode) {
            var self = this;
            var fighters = [{name: 'Subzero'}, {name: 'Kano'}]
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
                        if (o.getName() === 'kano') {
                            self.setLife($('.player_1'), o.getLife());
                        } else {
                            self.setLife($('.player_2'), o.getLife());
                        }
                    }

                },
                gameType: 'basic'
            };
            mk.start(options).ready(function () {
            });
        },

        setLife: function (container, life) {
            container.find(".player__health-inner").width(life + "%");
        },

        kick: function () {
            mk.game._moveFighter(mk.game.fighters[0], "walking");
            setTimeout(function() {
                mk.game._moveFighter(mk.game.fighters[0], "stand");
                mk.game._moveFighter(mk.game.fighters[0], kick.toLowerCase().replace("_", "-"));
            }, 1000);
        },
        opponentKick: function() {
            kick = "FORWARD-JUMP-KICK";
            mk.game._moveFighter(mk.game.fighters[1], kick.toLowerCase().replace("_", "-"));
        },

        moves: [
            "HIGH_KICK",
            "LOW_KICK",
            "LOW_PUNCH",
            "HIGH_PUNCH",
            "UPPERCUT",
            "SQUAT_LOW_KICK",
            "SQUAT_HIGH_KICK",
            "SQUAT_LOW_PUNCH",
        ]
    };
})();
