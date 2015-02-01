var Sounds = {
    init: function () {
        var self = this;
        var initVolume = 0.5;
        self.kickSounds = [
            "/sounds/Jab.mp3",
            "/sounds/Kick.mp3",
            "/sounds/RealisticPunch.mp3",
            "/sounds/RealisticPunch.mp3",
            "/sounds/StrongPunch.mp3",
            "/sounds/UpperCut.mp3"
        ];
        self.backgroundSound = null;
        self.volume = initVolume;
        $(".volume").on("click", function () {
            if (self.volume != 0) {
                self.volume = 0;
                self.pauseBackgroundSound();
                $(".volume").removeClass("glyphicon-volume-up").addClass("glyphicon-volume-off");
            } else {
                self.volume = initVolume;
                self.playBackgroundSound();
                $(".volume").removeClass("glyphicon-volume-off").addClass("glyphicon-volume-up");
            }
        });
    },

    playBackgroundSound: function () {
        var self = this;
        self.pauseBackgroundSound();
        self.backgroundSound = self.play('/sounds/backgroundsound2.mp3', true);
        self.backgroundSound.volume(0.01);
    },
    pauseBackgroundSound: function () {
        var self = this;
        if (self.backgroundSound != null) {
            console.log(self.backgroundSound);
            self.backgroundSound.stop();
            self.backgroundSound.mute();
        }
    },
    playKickSound: function () {
        var self = this;
        self.play(_.sample(self.kickSounds), false);

    },
    play: function (url, param) {
        self = this;
        var sound = new Howl({
            urls: [url],
            volume: self.volume,
            autoplay: true,
            loop: param
        }).play();
        return sound;
    }
};

$(Sounds.init.bind(Sounds));