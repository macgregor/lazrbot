var winston = require('winston');
var CloudWatchTransport = require('winston-aws-cloudwatch');
var NODE_ENV = process.env.NODE_ENV || 'development';
var LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

var instance;

function createInstance() {
  var logger = winston.createLogger({
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

  if (NODE_ENV != 'development') {
    if(process.env.CLOUDWATCH_ACCESS_KEY_ID && process.env.CLOUDWATCH_SECRET_ACCESS_KEY && process.env.CLOUDWATCH_REGION){
      logger.add(new CloudWatchTransport({
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
      }));
      logger.debug("Logger connected to Amazon Cloudwatch stream " + NODE_ENV)
    } else {
      logger.warn("Insufficient configuration to connect logger to Amazon Cloudwatch")
    }
  }

  logger.level = 'debug';
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
