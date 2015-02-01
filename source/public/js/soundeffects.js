var Sounds = {
    init: function () {
        var self = this;
        self.kickSounds = [
            "/sounds/Jab.mp3",
            "/sounds/Kick.mp3",
            "/sounds/RealisticPunch.mp3",
            "/sounds/RealisticPunch.mp3",
            "/sounds/StrongPunch.mp3",
            "/sounds/UpperCut.mp3"
        ];
        self.backgroundSound = null;
        self.isPlaying = true;

        $(".volume").on("click", function () {
            if (self.isPlaying) {
                self.pauseBackgroundSound();
                $(".volume").removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
            } else {
                self.playBackgroundSound();
                $(".volume").removeClass("glyphicon-volume-off").addClass("glyphicon-volume-up");
            }
            self.isPlaying = !self.isPlaying;
        });
    },

    playBackgroundSound: function () {
        var self = this;
        self.pauseBackgroundSound();
        self.backgroundSound = self.play('/sounds/backgroundsound2.mp3', true, 0.01);
    },
    pauseBackgroundSound: function () {
        var self = this;
        if (self.backgroundSound != null) {
            self.backgroundSound.stop();
            self.backgroundSound.mute();
        }
    },
    playKickSound: function () {
        var self = this;
        self.play(_.sample(self.kickSounds), false, 1.0);
    },
    play: function (url, loop, volume) {
        return new Howl({
            urls: [url],
            volume: volume,
            autoplay: true,
            loop: loop
        }).play();
    }
};

$(Sounds.init.bind(Sounds));