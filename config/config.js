const dotenv = require('dotenv');
const path = require('path');
const logger = require('./logger');


dotenv.config({ path: path.join(__dirname, '../.env') });

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../.env');
logger.info(`Loading environment variables from ${envFilePath}`);
dotenv.config({ path: envFilePath });


module.exports = {
  
  
  port: process.env.PORT || 8001,
  jwtSecret: process.env.JWT_SECRET,
  nodeVersion: process.env.NODE_VERSION,
  nodeEnv: process.env.NODE_ENV || 'development',
};

logger.info('Environment variables loaded successfully');