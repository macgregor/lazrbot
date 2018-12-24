LazrbotPlugin = require('./plugin.js').LazrbotPlugin;

class PingPlugin extends LazrbotPlugin{
  constructor(discordBot, logger){
    super('PingPlugin', discordBot, logger);
  }

  onBotMessage(user, userID, channelID, message, event){
    this.logger.debug('Plugin ' + this.name + ' overridden onBotMessage called.', user, userID, channelID, message, event);
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                this.discordBot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
  }
}

module.exports = {
  PingPlugin: PingPlugin
}