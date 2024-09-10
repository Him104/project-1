const fs = require('fs');
const path = require('path');

// Create a logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a writable stream to the log file
const logStream = fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' });

// Logger function to log messages to the console and to a log file
const logger = {
  info: function(message) {
    const logMessage = `[INFO] ${new Date().toISOString()}: ${message}`;
    console.log(logMessage);
    logStream.write(logMessage + '\n');
  },
  error: function(message) {
    const logMessage = `[ERROR] ${new Date().toISOString()}: ${message}`;
    console.error(logMessage);
    logStream.write(logMessage + '\n');
  },
};

module.exports = logger;