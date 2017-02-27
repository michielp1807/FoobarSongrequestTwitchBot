# MichielP1807’s Foobar Songrequest Twitch Bot
A Twitch bot that lets people from Twitch chat request songs from your Foobar2000 playlist.

##Needed for this bot:

* foobar2000

* node.js
  
* foo_httpcontrol (link at release)
  
* The httpcontrol data from here
  
* The Twitchbot code from here

##Commands:

* !songrequest [search query] - request songs from the Foobar2000 playlist

* !currentsong - bot will post the artist and title of the currently playing song in chat

* !previoussong - bot will post the artist and title of the previous song in chat

* !queuelength - bot will post the length of the playback queue in chat

##Features:

* Cooldowns for individual songs and for individual users

* Automatically save requests that aren't in your playlist to a text file

##How to setup: 

####  1. Setting up foobar2000
  
1.	Install Foobar2000
  
2.	Open Foobar2000
  
3.	Create a playlist with your music
  
4.	Close Foobar2000
  
####  2. Setting up foo_httpcontrol
  
1.	Install foo_httpcontrol
  
2.	Open Foobar2000
  
3.	Allow Foobar2000 access to the internet
  
4.	Go to http://127.0.0.1:8888/ in your browser to make sure it’s installed
  
6.	Open up appdata (press the windows key and R, type in %appdata% and press ok)
  
7.	Navigate to *C:\Users\UserNameHere\AppData\Roaming\foobar2000\*

8.  Move the foo_httpcontrol_data folder to that foobar2000 folder
  
9.	Go to http://127.0.0.1:8888/playlistviewer/ in your browser, you should see your playlist here
  
####  3. Setting up node.js
  
1.	Install node.js
  
2.	Open cmd
  
3.	Type node and hit enter
  
4.	You're now in javascript land!
  
####  4. Setting up twitch account for the bot
  
1.	Go to https://www.twitch.tv/ and log out if you’re logged in
  
2.	Sign up for a new account
  
3.	Log in to twitch with your bot account
  
4.	Go to https://twitchapps.com/tmi/ 
  
5.	Click on connect with twitch
  
6.	Make sure you’re using your bot account
  
7.	Copy the oauth code which looks like *oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx* with a bunch of random characters instead of x’s, you’ll need this code in the next step
  
####  5. Setting up the twitchbot
  
1.	Open the TwitchBot folder you've downloaded
  
#### TO BE UPDATED TO JSON FORMAT
  
2.	Open twitchbot.js in a text editor (notepad, atom, notepad++ etc.)
  
3.	Put the username of your twitchbot account you’ve created in between the quotation marks after the *var TwitchbotUsername =*
  
4.	Put your oauth code in between the quotation marks after *var TwitchbotPassword =*
  
5.	Put the channel name of the channel you would like your bot to join in between the quotation marks after *var TwitchbotJoinChannel =*
  
6.	Save the file and close the text editor
  
7.	Run twitchbot-starter.bat, it should be showing some of the songs in your playlist
  
8.	It now should be working, go to the twitch channel you added the bot to and write *!ping* in chat, it should respond with *pong!*, you can also see the chat in the twitchbot window

9.  Try requesting a song from your playlist, it now should be working
  
####  6. Trouble shooting
  
1.	If it’s adding the wrong song to the queue, make sure you’ve got the correct playlist active when you launch the bot, try restarting the bot
  
2.	If it’s not adding any song at all please first try to restart the bot, if it still doesn’t work ask for help

If you have any other problems please make an issue at: https://github.com/MichielP1807/FoobarSongrequestTwitchBot/issues/new or tweet me @MichielP1807!
