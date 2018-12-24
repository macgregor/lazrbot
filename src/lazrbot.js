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

var KarmaPlugin = require('./plugin/karma.js').KarmaPlugin;
var PingPlugin = require('./plugin/ping.js').PingPlugin;
logger.info('hello world');
var plugins = [new KarmaPlugin(bot, logger), new PingPlugin(bot, logger)];

for (var i = 0; i < plugins.length; i++) {
  plugins[i].register();
}
