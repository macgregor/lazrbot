var PluginStatus = Object.freeze({"uninitialized":0, "initialized":1, "failed":2})
var OperationStatus = Object.freeze({"success":0, "failed":1})

function PluginCallbackPayload(pluginStatus, operationStatus, payload, error){
  this.pluginStatus = pluginStatus;
  this.operationStatus = operationStatus;
  this.error = error;
  this.payload = payload;
}

class LazrbotPlugin extends Object {
  constructor(name, discordBot, logger){
    logger.info('plugin');
    super();
    this.name = name;
    this.discordBot = discordBot;
    this.logger = logger;
  }

  onBotReady(event){
    this.logger.debug('Plugin ' + this.name + ' default onBotReady called.', event);
  }

  onBotDisconnect(errorMessage, code){
    this.logger.debug('Plugin ' + this.name + ' default onBotDisconnect called.', errorMessage, code);
  }

  onBotMessage(user, userID, channelID, message, event){
    this.logger.debug('Plugin ' + this.name + ' default onBotMessage called.', user, userID, channelID, message, event);
  }

  onUserPresence(user, userID, status, game, event){
    this.logger.debug('Plugin ' + this.name + ' default onUserPresence called.', user, userID, status, game, event);
  }

  onAnyEvent(event){
    this.logger.debug('Plugin ' + this.name + ' default onAnyEvent called.', event);
  }

  register(){
    this.discordBot.on('ready', event => this.onBotReady(event));
    this.discordBot.on('disconnect', (errorMessage, code) => this.onBotDisconnect(errorMessage, code));
    this.discordBot.on('message', (user, userID, channelID, message, event) => this.onBotMessage(user, userID, channelID, message, event));
    this.discordBot.on('presence', (user, userID, status, game, event) => this.onUserPresence(user, userID, status, game, event));
    this.discordBot.on('any', (event) => this.onAnyEvent(event) );
  }
}

module.exports = {
  PLUGIN_STATUS: PluginStatus,
  OPERATION_STATUS: OperationStatus,
  PluginCallbackPayload: PluginCallbackPayload,
  LazrbotPlugin: LazrbotPlugin
}