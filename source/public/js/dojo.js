(function () {
    var Dojo = {
        init: function () {
            var self = this;
            var counter = 0;

            var isChannelReady;
            var isInitiator = false;
            var isStarted = false;
            var localStream;
            var pc;
            var remoteStream;
            var turnReady;
            var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

            var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

            // Set up audio and video regardless of what devices are present.
            var sdpConstraints = {
                'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                }
            };

            // connect to the socket
            var socket = io.connect('/socket');
            this.socket = socket;

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



            // on connection to server get the id of person's room
            socket.on('connect', function () {
                console.log("connect");
                socket.emit('load', self.getData().id);
            });

            // receive the names of all people in the game room
            socket.on('loaded', function (data) {
                console.log("loaded");
                if (data.players === 0) {
                    isInitiator = true;
                    $(".invite").show();
                    socket.emit('join', self.getData());
                }
                if (data.players === 1) {
                    isChannelReady = true;
                    $(".login").show();
                    socket.emit('join', self.getData());
                }
                console.log(data.players);
            });

            socket.on('jointed', function (room) {
                console.log('This peer has joined room ' + room);
                isChannelReady = true;
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
                if (roomId == data.room) {
                    console.log(data.user + ' left.');
                }
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

            ///////////////////////////

            function sendMessage(message) {
                console.log('Client sending message: ', message);
                socket.emit('message', message);
            }

            socket.on('message', function (message) {
                console.log('Client received message:', message);
                if (message === 'got user media') {
                    maybeStart();
                } else if (message.type === 'offer') {
                    if (!isInitiator && !isStarted) {
                        maybeStart();
                    }
                    pc.setRemoteDescription(new RTCSessionDescription(message));
                    doAnswer();
                } else if (message.type === 'answer' && isStarted) {
                    pc.setRemoteDescription(new RTCSessionDescription(message));
                } else if (message.type === 'candidate' && isStarted) {
                    var candidate = new RTCIceCandidate({
                        sdpMLineIndex: message.label,
                        candidate: message.candidate
                    });
                    pc.addIceCandidate(candidate);
                } else if (message === 'bye' && isStarted) {
                    handleRemoteHangup();
                }
            });

            ////////////////////////////////////////////////////

            var localVideo = document.querySelector('#localVideo');
            var remoteVideo = document.querySelector('#remoteVideo');

            function handleUserMedia(stream) {
                console.log('Adding local stream.');
                localVideo.src = window.URL.createObjectURL(stream);
                localStream = stream;
                sendMessage('got user media');
                if (isInitiator) {
                    maybeStart();
                }
            }

            function handleUserMediaError(error) {
                console.log('getUserMedia error: ', error);
            }

            var constraints = {video: true};
            getUserMedia(constraints, handleUserMedia, handleUserMediaError);

            console.log('Getting user media with constraints', constraints);

            if (location.hostname != "localhost") {
                requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
            }

            function maybeStart() {
                console.log('####################################');
                console.log(!isStarted);
                console.log(typeof localStream);
                console.log(isChannelReady);
                console.log('####################################');
                if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
                    createPeerConnection();
                    pc.addStream(localStream);
                    isStarted = true;
                    console.log('isInitiator', isInitiator);
                    if (isInitiator) {
                        doCall();
                    }
                }
            }

            window.onbeforeunload = function (e) {
                sendMessage('bye');
            }

            /////////////////////////////////////////////////////////

            function createPeerConnection() {
                try {
                    pc = new RTCPeerConnection(null);
                    pc.onicecandidate = handleIceCandidate;
                    pc.onaddstream = handleRemoteStreamAdded;
                    pc.onremovestream = handleRemoteStreamRemoved;
                    console.log('Created RTCPeerConnnection');
                } catch (e) {
                    console.log('Failed to create PeerConnection, exception: ' + e.message);
                    alert('Cannot create RTCPeerConnection object.');
                    return;
                }
            }

            function handleIceCandidate(event) {
                console.log('handleIceCandidate event: ', event);
                if (event.candidate) {
                    sendMessage({
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                } else {
                    console.log('End of candidates.');
                }
            }

            function handleRemoteStreamAdded(event) {
                console.log('Remote stream added.');
                remoteVideo.src = window.URL.createObjectURL(event.stream);
                remoteStream = event.stream;
            }

            function handleCreateOfferError(event) {
                console.log('createOffer() error: ', e);
            }

            function doCall() {
                console.log('Sending offer to peer');
                pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
            }

            function doAnswer() {
                console.log('Sending answer to peer.');
                pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
            }

            function setLocalAndSendMessage(sessionDescription) {
                // Set Opus as the preferred codec in SDP if Opus is present.
                sessionDescription.sdp = preferOpus(sessionDescription.sdp);
                pc.setLocalDescription(sessionDescription);
                console.log('setLocalAndSendMessage sending message', sessionDescription);
                sendMessage(sessionDescription);
            }

            function requestTurn(turn_url) {
                var turnExists = false;
                for (var i in pc_config.iceServers) {
                    if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
                        turnExists = true;
                        turnReady = true;
                        break;
                    }
                }
                if (!turnExists) {
                    console.log('Getting TURN server from ', turn_url);
                    // No TURN server. Get one from computeengineondemand.appspot.com:
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var turnServer = JSON.parse(xhr.responseText);
                            console.log('Got TURN server: ', turnServer);
                            pc_config.iceServers.push({
                                'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                                'credential': turnServer.password
                            });
                            turnReady = true;
                        }
                    };
                    xhr.open('GET', turn_url, true);
                    xhr.send();
                }
            }

            function handleRemoteStreamAdded(event) {
                console.log('Remote stream added.');
                remoteVideo.src = window.URL.createObjectURL(event.stream);
                remoteStream = event.stream;
            }

            function handleRemoteStreamRemoved(event) {
                console.log('Remote stream removed. Event: ', event);
            }

            function hangup() {
                console.log('Hanging up.');
                stop();
                sendMessage('bye');
            }

            function handleRemoteHangup() {
                //  console.log('Session terminated.');
                // stop();
                // isInitiator = false;
            }

            function stop() {
                isStarted = false;
                // isAudioMuted = false;
                // isVideoMuted = false;
                pc.close();
                pc = null;
            }

            ///////////////////////////////////////////

            // Set Opus as the default audio codec if it's present.
            function preferOpus(sdp) {
                var sdpLines = sdp.split('\r\n');
                var mLineIndex;
                // Search for m line.
                for (var i = 0; i < sdpLines.length; i++) {
                    if (sdpLines[i].search('m=audio') !== -1) {
                        mLineIndex = i;
                        break;
                    }
                }
                if (!mLineIndex) {
                    return sdp;
                }

                // If Opus is available, set it as the default in m line.
                for (i = 0; i < sdpLines.length; i++) {
                    if (sdpLines[i].search('opus/48000') !== -1) {
                        var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                        if (opusPayload) {
                            sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
                        }
                        break;
                    }
                }

                // Remove CN in m line and sdp.
                sdpLines = removeCN(sdpLines, mLineIndex);

                sdp = sdpLines.join('\r\n');
                return sdp;
            }

            function extractSdp(sdpLine, pattern) {
                var result = sdpLine.match(pattern);
                return result && result.length === 2 ? result[1] : null;
            }

            // Set the selected codec to the first in m line.
            function setDefaultCodec(mLine, payload) {
                var elements = mLine.split(' ');
                var newLine = [];
                var index = 0;
                for (var i = 0; i < elements.length; i++) {
                    if (index === 3) { // Format of media starts from the fourth.
                        newLine[index++] = payload; // Put target payload to the first.
                    }
                    if (elements[i] !== payload) {
                        newLine[index++] = elements[i];
                    }
                }
                return newLine.join(' ');
            }

            // Strip CN from sdp before CN constraints is ready.
            function removeCN(sdpLines, mLineIndex) {
                var mLineElements = sdpLines[mLineIndex].split(' ');
                // Scan from end for the convenience of removing an item.
                for (var i = sdpLines.length - 1; i >= 0; i--) {
                    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
                    if (payload) {
                        var cnPos = mLineElements.indexOf(payload);
                        if (cnPos !== -1) {
                            // Remove CN payload from m line.
                            mLineElements.splice(cnPos, 1);
                        }
                        // Remove CN line in sdp
                        sdpLines.splice(i, 1);
                    }
                }

                sdpLines[mLineIndex] = mLineElements.join(' ');
                return sdpLines;
            }


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
