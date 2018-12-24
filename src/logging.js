var winston = require('winston');
var CloudWatchTransport = require('winston-aws-cloudwatch');
var LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
var CLOUDWATCH_STREAM = process.env.CLOUDWATCH_STREAM || 'prod';
var CLOUDWATCH_REGION = process.env.CLOUDWATCH_REGION || 'us-east-1';

var instance;

function createInstance() {
  var logger = winston.createLogger({
      transports: [new winston.transports.Console({
           format: winston.format.combine(
              winston.format.colorize({ all: true }),
              winston.format.printf(({ timestamp, level, message, meta }) => `${timestamp} [${level}] - ${message} ${meta? JSON.stringify(meta, null, 2) : ''}`),
              winston.format.timestamp({
                  format: 'YYYY-MM-DD HH:mm:ss'
              }),
              winston.format.splat())
          })
      ],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.splat()
      ),
      exitOnError: false
  });

  if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY){
    logger.add(new CloudWatchTransport({
      logGroupName: 'lazrbot-logs',
      logStreamName: CLOUDWATCH_STREAM,
      createLogGroup: false,
      createLogStream: true,
      submissionInterval: 5000,
      submissionRetryCount: 3,
      awsConfig: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: CLOUDWATCH_REGION
      }
    }));
    logger.debug("Logger connected to Amazon Cloudwatch stream " + CLOUDWATCH_STREAM)
  } else {
    logger.warn("Insufficient configuration to connect logger to Amazon Cloudwatch")
  }

  logger.level = LOG_LEVEL;
  return logger;
}

module.exports = {
  getInstance: function(){
    if (!instance) {
        instance = createInstance();
    }
    return instance;
  }
}
