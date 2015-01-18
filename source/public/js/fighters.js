(function () {
    window.Fight = {
        init: function() {
            var self = this;
            var options = {
                arena: {
                    container: document.getElementById('arena'),
                    arena: mk.arenas.types.THRONE_ROOM,
                    width: document.body.clientWidth,
                    height: $(window).height()
                },
                fighters: [{ name: 'Subzero' }, { name: 'Kano' }],
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
            mk.start(options).ready(function () {});
        },

        setLife: function(container, life) {
            container.find(".player__health-inner").width(life + "%");
        },

        kick: function() {
            mk.game._moveFighter(mk.game.fighters[0], _.sample(this.moves));
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
            "FORWARD_JUMP_KICK",
            "FORWARD_JUMP_PUNCH"
        ]
    };
})();
