require('dotenv').config()
var Discord = require('discord.io');
var winston = require('winston');
var CloudWatchTransport = require('winston-aws-cloudwatch');

var NODE_ENV = process.env.NODE_ENV || 'development';

// your centralized logger object
let logger = winston.createLogger({
    transports: [new winston.transports.Console({
         format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.printf(item => `${item.timestamp} [${item.level}] - ${item.message}`),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }))
        })
    ],
    format: winston.format.combine(
         winston.format.timestamp({
           format: 'YYYY-MM-DD HH:mm:ss'
         })
    ),
    exitOnError: false
});

logger.level = 'debug';
var config = {
  logGroupName: 'lazrbot-logs',
  logStreamName: NODE_ENV,
  createLogGroup: false,
  createLogStream: true,
  submissionInterval: 5000,
  submissionRetryCount: 3,
  awsConfig: {
    accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    region: process.env.CLOUDWATCH_REGION
  }
}

if (NODE_ENV != 'development') logger.add(new CloudWatchTransport(config));

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
