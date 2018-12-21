const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'env') })
if(!process.env.DISCORD_AUTH_TOKEN){
  throw Error ('No auth token to connect to discord server. Set the DISCORD_AUTH_TOKEN env variable')
}

var Discord = require('discord.io');
var logger = require('./logging.js').getInstance();

// Initialize Discord Bot
var bot = new Discord.Client({
   token: process.env.DISCORD_AUTH_TOKEN,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});
