const express = require('express');
const bodyParser = require("body-parser");
const helmet = require('helmet');
const route = require('./routes/route.js');
const mongoose = require("mongoose");
const cors = require('cors');
const config = require('./config/config.js')
const logger = require('./config/logger.js')
require('dotenv').config({ path: '.env' });
const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());
app.options('*', cors());

mongoose.connect(process.env.mongo_uri)

.then( () => console.log("Mongo is connected"))

.catch(err => console.log(err))

app.use('/', route); 


const server = app.listen(config.port, () => {

    logger.info(`App has been started on port ${config.port}`);
  });
  
  
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
  
  module.exports = app;
  