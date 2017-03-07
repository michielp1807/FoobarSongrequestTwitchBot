// Foobar Songrequests Twitch Bot by MichielP1807

var TwitchbotUsername = "YOUR_BOT_NAME_HERE";
var TwitchbotPassword = "oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var TwitchbotJoinChannel = "CHANNEL_NAME_TO_GO_TO";
var SongCooldown = 600;
var UserCooldown = 30;

var songIsInCoolDown = [];
var userIsInCoolDown = {};

console.log(" > Running Server");
console.log(' ');

var http = require('http');
console.log(" > Loading User Data");
console.log(' ');
const fs = require('fs');
fs.readFile('twitchbot-data.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    var obj = JSON.parse(data);
    TwitchbotUsername = obj.username;
	TwitchbotPassword = obj.password;
	TwitchbotJoinChannel = obj.joinChannel;
	SongCooldown = obj.songCooldown;
	UserCooldown = obj.userCooldown;
}});

console.log(" > Loading Foobar Playlist");
console.log(' ');
var songCurrent = ["",""];
var songPrevious = ["",""];
checkNowPlaying();
songPrevious = songCurrent;
var songs = [];
var playlistFromHttp;
var request = require("request");
request({
    url: "http://127.0.0.1:8888/playlistviewer/?param3=playlist.json",
    json: true
}, function (error, response, body) { 
    if (!error && response.statusCode === 200) {
		playlistFromHttp = body;
    }
})
setTimeout(function(){
	// format loaded songs
	songs = songs.concat(playlistFromHttp.split("</br>"));
	for(var i=0; i<songs.length; i++) {
		if (songs[i].indexOf('">')!=-1) {
			songs[i] = songs[i].split('">')[1];		
			console.log(songs[i]);
		}
	}

	// connect to twitch chat
	var tmi = require("tmi.js");
	var options = {
		options: {
			debug: true
		},
		connection: {
			cluster: "aws",
			reconnect: true
		},
		identity: {
			username: TwitchbotUsername,
			password: TwitchbotPassword
		},
		channels: [TwitchbotJoinChannel]
	}
	var client = new tmi.client(options);
	client.connect();
	client.on("chat", function(channel, user, message, self) { // on message
		var username = user["display-name"];
		message = message.toLowerCase();
		
		// COMMAND: !ping
		if (message.indexOf("!ping")==0) {
			client.say(channel, "pong!");
		// COMMAND: !currentsong
		} else if (message.indexOf("!currentsong")==0 || message.indexOf("!currenttrack")==0 || message.indexOf("!nowplaying") || message.indexOf("!song")==0) {
			request({
				url: "http://127.0.0.1:8888/playlistviewer/?param3=nowPlaying.json",
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					if (body.isPlaying == 1) {
						client.say(channel, 'Current song: "' + songCurrent[1] + '" by ' + songCurrent[0]);
					} else {
						client.say(channel, "No music playing... FeelsBadMan");
					}
				}
			})
		// COMMAND: !previoussong
		} else if (message.indexOf("!previoussong")==0 || message.indexOf("!previoustrack")==0) {
			if (songPrevious[0].length>1 && songPrevious[1].length>1) {
				client.say(channel, 'Previous song: "' + songPrevious[1] + '" by ' + songPrevious[0]);
			} else {
				client.say(channel, "I can't remember the previous song... FeelsBadMan");
			}
		// COMMAND: !queuelength
		} else if (message.indexOf("!queuelength")==0) {
			request({
				url: "http://127.0.0.1:8888/playlistviewer/?param3=nowPlaying.json",
				json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					if (body.queueLength == "") {
						client.say(channel, 'The queue is currently empty');
					} else {
						client.say(channel, 'The playback queue is ' + body.queueLength + ' long');
					}
				}
			})
		// COMMAND: !songrequest
		} else if (message.indexOf("!songrequest")==0 || message.indexOf("!sq")==0) {
			var songWord = message.split(" ");;
			songWord.shift(); // remove the command name
			var songPossible = [];
			var songIndex = -1;
			if (songWord.length == 0 || message.substring(13) == false || message.substring(13)=="***" || message.indexOf("!songrequest ")!=0) {
				client.say(channel, 'Request songs from the playlist by typing !songrequest + a search query!');
			} else {
				for (i = 0; i < songs.length; i++) {
					var active = true;
					for (j = 0; j < songWord.length; j++) {
						if (songs[i].toLowerCase().indexOf(songWord[j].toLowerCase())==-1 && songWord[j]!="***") active=false;
					}
					if (active) {
						songPossible.push(i);
					}
				}
				if (songPossible.length > 1) { //choose a possible song
					var songPossibleNoRemix = [];
					for (i = 0; i < songPossible.length; i++) { // prefer non remixes/acapellas
						if (songs[songPossible[i]].toLowerCase().indexOf("remix")==-1&&songs[songPossible[i]].toLowerCase().indexOf("acapella")==-1) {
							songPossibleNoRemix.push(songPossible[i]);
						}
					}
					if (songPossibleNoRemix.length > 1) {
						songIndex = songPossibleNoRemix[Math.floor(Math.random()*songPossibleNoRemix.length)];
					} else {
						songIndex = songPossible[Math.floor(Math.random()*songPossible.length)];
					}
				} else {
					songIndex = songPossible[0];
				}
				if (songPossible.length > 0) {
					if (songIsInCoolDown[songIndex] === true) {
						client.say(channel, 'The song "'+songs[songIndex]+'" is on a cooldown... FeelsBadMan');
					} else if (userIsInCoolDown[username.toLowerCase()] === true) {
						client.say(channel, 'You can only request a song every ' + UserCooldown + ' seconds ... FeelsBadMan');
					} else {
						if (username.toLowerCase != channel) {
							songIsInCoolDown[songIndex] = true;
							userIsInCoolDown[username.toLowerCase()] = true;
							setTimeout(resetSongCoolDown,SongCooldown*1000,songIndex);
							setTimeout(resetUserCoolDown,UserCooldown*1000,username);
						}
						http.get("http://127.0.0.1:8888/default/?cmd=QueueItems&param1="+(songIndex),function(res){
							client.say(channel, 'I found something for you: "'+songs[songIndex]+'" FeelsGoodMan');
						});
					}
				} else {
					client.say(channel, "I didn't find anything FeelsBadMan");
					fs.appendFile('failedSongs.txt',  "\r\n [" + username + "] " + message.substring(13), function (err) {});
				}
			}
		} 
	});
},1000);

function checkNowPlaying() {
	var request = require("request");
	request({
		url: "http://127.0.0.1:8888/playlistviewer/?param3=nowPlaying.json",
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var songCurrentP = songCurrent;
			songCurrent = [body.artist, body.title];
			if (songCurrent[0] != songCurrentP[0] || songCurrent[1] != songCurrentP[1]) {
				console.log(" ");
				console.log(" > New song: " + songCurrent[0] + " - " + songCurrent[1]);
				console.log(" ");
				songPrevious = songCurrentP;
			}
		}
	})
	setTimeout(checkNowPlaying,10000);
}

function resetSongCoolDown(songIndexToReset) {
	console.log(" ");
	console.log("Reset cooldown for " + songs[songIndexToReset]);
	console.log(" ");
	songIsInCoolDown[songIndexToReset] = false;
}

function resetUserCoolDown(username) {
	console.log(" ");
	console.log("Reset cooldown for " + username);
	console.log(" ");
	userIsInCoolDown[username.toLowerCase()] = false;
}