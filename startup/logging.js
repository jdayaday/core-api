// Required modules
const winston = require('winston');					// Log handler
require('express-async-errors');					// Async error handler

module.exports = function() {
    // Trap errors
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });

    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });

    // Set logging transports
    winston.add(new winston.transports.File({filename: 'logfile.log'}));
    winston.add(new winston.transports.Console({colorize: true, prettyprint: true}));
}