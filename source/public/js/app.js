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

    answerForm.keypress(function (e) {
        // submit answer on enter
        if (e.which == 13) {
            e.preventDefault();
            answerForm.trigger('submit');
        }
    });

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

    // connect to the socket
    var socket = io.connect('/socket');

    // on connection to server get the id of person's room
    socket.on('connect', function () {
        socket.emit('load', roomId);
    });

    // receive the names of all people in the game room
    socket.on('loaded', function (data) {
        if (data.players >= 2) {
            console.log('This game is full.');
            return;
        }

        loginForm.on('submit', function (e) {
            e.preventDefault();
            username = $.trim(usernameInput.val());
            if (username.length < 1) {
                console.log("Please enter a nick name longer than 1 character!");
                return;
            }
            if (data.players === 0) {
                // show invitation with link pointing to this game room
                invite.css('display', 'block');
                link.text(window.location.href);
            }

            if (data.players === 1 && username == data.user) {
                console.log("There is a player with username \"" + username + "\" in this game!");
                return;
            }
            // remove login form
            login.remove();

            // call the server-side function 'join' and send user's id
            socket.emit('join', {user: username, id: roomId});
        });
    });

    socket.on('start', function (data) {
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
})();