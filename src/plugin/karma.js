LazrbotPlugin = require('./plugin.js').LazrbotPlugin;

var Karma = (function () {
  const DYNAMO_REGION = process.env.DYNAMODB_REGION || 'us-east-1';

  let logger = require('../logging.js').getInstance(),
      AWS = require('aws-sdk')
      dynamo = require('dynamodb'),
      joi = require('joi');

  AWS.config.update({region: 'us-east-1'});

  var KarmaModel = dynamo.define('Karma', {
    tableName: 'karma',
    hashKey : 'id',
    timestamps : true,
    schema : {
      id : joi.string(),
      karma : joi.number()
    }
  });

  KarmaModel.increment = function(id, callback){
    KarmaModel.createOrUpdate(id, {$add : 1}, callback);
  }

  KarmaModel.decrement = function(id, callback){
    KarmaModel.createOrUpdate(id, {$add : -1}, callback);
  }

  KarmaModel.reset = function(id, callback){
    KarmaModel.createOrUpdate(id, 0, callback);
  }

  KarmaModel.count = function(id, callback){
    KarmaModel.query(id).select('COUNT').exec(callback);
  }

  KarmaModel.get = function(id, callback){
    KarmaModel.query(id).exec(callback);
  }

  KarmaModel.createOrUpdate = function(id, karma, callback){
    KarmaModel.count(id, (err, response) => {
      if(err) throw err;
      if(response.Count > 0){
        KarmaModel.update({id : id, karma : karma}, function (err, response) {
          if(err) throw err;
          logger.debug('KarmaModel.createOrUpdate (update)', response);
          callback(response);
        });
      } else{
        KarmaModel.create({id: id, karma: 1}, function (err, response) {
          if(err) throw err;
          logger.debug('KarmaModel.createOrUpdate (create)', response);
          callback(response);
        });
      }
    });
  }

  function init(callback){
    if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY){
      logger.info('Configuring AWS credentials for dynamo', {accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: DYNAMO_REGION});
      dynamo.AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: DYNAMO_REGION});
    } else{
      logger.info('AWS credentials not found, relying on properly configured IAM policies for access. If not, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables.');
      dynamo.AWS.config.update({region: DYNAMO_REGION});
    }
    dynamo.createTables(function(err){
      if(err) throw err;
      callback();
    });
  }

  function increment(id, callback){
    KarmaModel.increment(id, callback);
  }

  function decrement(id, callback){
    KarmaModel.decrement(id, callback);
  }

  function reset(id, callback){
    KarmaModel.reset(id, callback);
  }

  function get(id){
    return KarmaModel.get(id);
  }

  return {
      init: init,
      increment: increment,
      decrement: decrement,
      reset: reset,
      get: get
  };

})();

class KarmaPlugin extends LazrbotPlugin{
  constructor(discordBot, logger){
    super('KarmaPlugin', discordBot, logger);
  }

  register(){
    try{
      Karma.init(() => super.register());
    } catch(err){
      this.logger.error("Unable to register Karma plugin due to DynamoDB initialization error", err);
    }
  }

  onBotMessage(user, userID, channelID, message, event){
    this.logger.debug('Plugin ' + this.name + ' overridden onBotMessage called.', user, userID, channelID, message, event);
    if(this.discordBot.id == userID || this.discordBot.username == user){
      return;
    }

    var incrementRegex = /(?:\s*@?(\S*?)\s*\+{2}\s*?)/g
    var matches = [];
    while(matches = incrementRegex.exec(message)){
      try{
        Karma.increment(matches[1], response => {
          this.discordBot.sendMessage({
              to: channelID,
              message: response.get('id') + ' now has ' + response.get('karma') + ' karma.'
          });
        });
      } catch(err){
        this.logger.error(err);
      }
    }

    var decrementRegex = /(?:\s*@?(\S*?)\s*\-{2}\s*?)/g
    while(matches = decrementRegex.exec(message)){
      try{
        Karma.decrement(matches[1], response => {
          this.discordBot.sendMessage({
              to: channelID,
              message: response.get('id') + ' now has ' + response.get('karma') + ' karma.'
          });
        });
      } catch(err){
        this.logger.error(err);
      }
    }
  }
}

module.exports = {
  KarmaPlugin: KarmaPlugin
}