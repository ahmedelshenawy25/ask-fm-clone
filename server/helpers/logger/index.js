const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDirectory))
  fs.mkdirSync(logsDirectory);

const logger = winston.createLogger({
  level: 'debug',
  silent: process.env.NODE_ENV === 'test',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.prettyPrint()
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, 'logs.log')
    })
  ]
});

module.exports = logger;