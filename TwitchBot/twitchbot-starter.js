var request = require('request');
var fs = require('fs');

fs.readFile('twitchbot-data.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
		var obj = JSON.parse(data);
		if (obj.autoUpdate==true){
			request({
				url: "https://raw.githubusercontent.com/MichielP1807/FoobarSongrequestTwitchBot/master/TwitchBot/twitchbot.js",
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					fs.writeFile('./twitchbot.js', body, function(err) {
						if(err) {return console.log(err);}
						console.log('twitchbot has been checked for updates');
						var twitchbot = require('./twitchbot.js');
					});
				}
			})
		} else {
			var twitchbot = require('./twitchbot.js');
		}
	}
});