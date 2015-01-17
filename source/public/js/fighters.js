(function () {
    window.Fighter = {
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
