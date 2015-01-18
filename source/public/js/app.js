(function () {
    var roomId = 'notepad++/1111';
    var username = '';
    var opponent = '';
    var total = 0;

    // cached elements
    var login = $('.login'),
        invite = $('.invite'),
        queryArea = $('.query'),
        shortcutAction = $('#shortcut-action'),
        link = $('#share-link'),
        loginForm = $('.loginForm'),
        playersArea = $('.players'),
        opponentName = $('#opponent-name'),
        playerName = $('#player-name'),
        usernameInput = $('#username'),
        answerForm = $('#answer-form'),
        answerInput = $('#answer'),
        winnerName = $('#winner-name'),
        winnerArea = $('.winner');

    console.log(getData());
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

    // connect to the socket
    var socket = io.connect('/socket');

    // on connection to server get the id of person's room
    socket.on('connect', function () {
        console.log("connect");
        socket.emit('load', roomId);
    });

    // receive the names of all people in the game room
    socket.on('loaded', function (data) {
        console.log("loaded");
        if (data.players >= 2) {
            console.log('This game is full.');
            return;
        }
        console.log('onloaded event');

        // call the server-side function 'join' and send user's id
        socket.emit('join', getData());
    });

    socket.on('start', function (data) {
        console.log("start");
        if (data.id == roomId) {
            total = data.total;

            if (username === data.users[0]) {
                opponent = data.users[1];
            }
            else {
                opponent = data.users[0];
            }

            // remove invitation
            invite.remove();

            // show players area
            playersArea.css('display', 'block');
            opponentName.text(opponent + '[' + 0 + '/' + total + ']');
            playerName.text(username + '[' + 0 + '/' + total + ']');

            // show query area
            queryArea.css('display', 'block')
        }
    });

    socket.on('query', function (data) {
        shortcutAction.text(data.query);
    });

    socket.on('game over', function (data) {
        queryArea.remove();
        winnerName.text(data.winner);
        winnerArea.css('display', 'block');
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

    function getData (prop) {
        var name = "userName";
        var parts = location.pathname.split("/")
        return {
            user: (decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null),
            id: parts[2] + "/" + parts[3]
        };
    }
})();
