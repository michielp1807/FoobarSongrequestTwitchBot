# MichielP1807’s Foobar Songrequest Twitch Bot
A Twitch bot that lets people from Twitch chat request songs from your Foobar2000 playlist.

##Needed for this bot:
  •	foobar2000
  
  •	foo_httpcontrol
  
  •	httpcontrol data
  
  •	node.js
  
  •	twitchbot
##How to use: 
####  1. Setting up foobar2000
  
  a.	Install Foobar2000
  
  b.	Open Foobar2000
  
  c.	Create Playlist With Your Music
  
  d.	Close Foobar2000
  
####  2. Setting up foo_httpcontrol
  
  a.	Install foo_httpcontrol
  
  b.	Open Foobar2000
  
  c.	Allow Foobar2000 access to the internet
  
  d.	Go to http://127.0.0.1:8888/ in your browser to make sure it’s installed
  
  e.	Unzip http control playlistviewer
  
  f.	Open up appdata by pressing the windows key and R and type in %appdata% and press ok
  
  g.	Move playlistviewer to C:\Users\UserNameHere\AppData\Roaming\foobar2000\foo_httpcontrol_data\
  
  h.	Go to http://127.0.0.1:8888/playlistviewer/ in your browser, you should see your playlist here
  
####  3. Setting up node.js
  
  a.	Install node.js
  
  b.	Open cmd
  
  c.	Type node and hit enter
  
  d.	> Now in javascript land
  
####  4. Setting up twitch account for the bot
  
  a.	Go to https://www.twitch.tv/ and log out if you’re logged in
  
  b.	Sign up for a new account
  
  c.	Log in to twitch with your bot account
  
  d.	Go to https://twitchapps.com/tmi/ 
  
  e.	Click on connect with twitch
  
  f.	Make sure you’re using your bot account
  
  g.	Copy the oauth code which looks like oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx with a bunch of random characters instead of x’s, you’ll need this code in the next step
  
####  5. Setting up the twitchbot
  
  a.	Unzip the twitchbot
  
  b.	Open twitchbot.js in a text editor (notepad, atom, notepad++ etc.)
  
  c.	Put the username of your twitchbot account you’ve created in between the quotation marks after the var TwitchbotUsername = 
  
  d.	Put your oauth code in between the quotation marks after var TwitchbotPassword = 
  
  e.	Put the channel name of the channel you would like your bot to join in between the quotation marks after var TwitchbotJoinChannel = 
  
  f.	Save the file and close the text editor
  
  g.	Run twitchbot-starter.bat, it should be showing some of the songs in your playlist
  
  h.	It now should be working, go to the twitch channel you added the bot to and write !ping in chat, it should respond with pong!, you can also see the chat in the twitchbot window
  
####  6. Known problems
  
  a.	If it’s adding the wrong song to the queue, make sure you’ve got the correct playlist active when you launch the bot, try restarting the bot
  
  b.	If it’s not adding any song at all please first try to restart the bot, if it still doesn’t work ask for help
