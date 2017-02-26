// Twitchbot.js by MichielP1807

// Setup your bot here

var TwitchbotUsername = "YOUR_BOT_NAME_HERE";
var TwitchbotPassword = "oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var TwitchbotJoinChannel = "CHANNEL_NAME_TO_GO_TO";

var SongCooldown = 600; // the minimal amount of time in between requests of the same song (in seconds)

// Scary code down bellow, don't get spooked


console.log(" > Running Server");
console.log(' ');
var songIsInCoolDown = [];

//read music info
var http = require('http');
console.log(" > Loading Foobar Playlist");
console.log(' ');
var songs = [];
var playlistFromHttp;
var req = http.request('http://127.0.0.1:8888/playlistviewer/', function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		playlistFromHttp+=chunk;
	});
});   
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();
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
		// !ping
		if (message === "!ping") {
			client.say(channel, "pong!");
		// !currentsong
		} else if (message.indexOf("currentsong")!=-1 || message.indexOf("current song")!=-1 || message.indexOf("current track")!=-1 || message.indexOf("currenttrack")!=-1 || (message.indexOf("what")!=-1&&(message.indexOf("song")!=-1||message.indexOf("track")!=-1||message.indexOf("music")!=-1)||message.indexOf("playing")!=-1)) {
			fs.readFile('NowPlaying.txt', 'utf8', (err, data) => {
				if (err) throw err;
				console.log(data);
				client.say(channel, data);
			});
		} else if (message.indexOf("!songrequest ")==0) {
			var songWord = message.substring(13).split(" ");;
			var songPossible = [];
			var songIndex = -1;
			for (i = 0; i < songs.length; i++) {
				var active = true;
				for (j = 0; j < songWord.length; j++) {
					if (songs[i].toLowerCase().indexOf(songWord[j].toLowerCase())==-1) active=false;
				}
				if (active) {
					songPossible.push(i);
				}
			}
			//choose a possible song
			if (songPossible.length > 1) {
				var songPossibleNoRemix = [];
				for (i = 0; i < songPossible.length; i++) { // filter out remixes
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
				//console.log(songIsInCoolDown);
				if (songIsInCoolDown[songIndex] === true) {
					client.say(channel, 'The song "'+songs[songIndex]+'" is on a cooldown... FeelsBadMan');
				} else {
					songIsInCoolDown[songIndex] = true;
					setTimeout(resetCoolDown,SongCooldown*1000,songIndex)
					http.get("http://127.0.0.1:8888/default/?cmd=QueueItems&param1="+(songIndex),function(res){
						client.say(channel, 'I found something for you: "'+songs[songIndex]+'" FeelsGoodMan');
					});
				}
			} else {
				client.say(channel, "I didn't find anything FeelsBadMan");
				fs.appendFile('failedSongs.txt',  "\r\n [" + username + "] " + message.substring(13), function (err) {});
			}
		}
	});
},1000);

function resetCoolDown(songIndexToReset) {
	console.log("Reset cooldown for " + songs[songIndexToReset]);
	songIsInCoolDown[songIndexToReset] = false;
}