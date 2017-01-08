var winston = require("winston");

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            level: "debug",
            timestamp: true,
            filename: "concertspot.log"
        })
    ]
});

console.error = logger.error;
console.log = logger.info;
console.info = logger.info;
console.debug = logger.debug;
console.warn = logger.warn;

module.exports = console;