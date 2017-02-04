const mongoose = require('mongoose');
const config = require('./config');

const MONGOOSE_CONNECTED = 'connected';
const MONGOOSE_DISCONNECTED = 'disconnected';
const MONGOOSE_ERROR = 'error';

const APP_INTERRUPTED = 'SIGINT';
const APP_TERMINATED = 'SIGTERM';
const APP_RESTARTED = 'SIGHUP';

const APP_SIGNALS = [
  APP_INTERRUPTED,
  APP_TERMINATED,
  APP_RESTARTED
];


function init() {
  const connection = mongoose.connection;
  [MONGOOSE_CONNECTED, MONGOOSE_DISCONNECTED, MONGOOSE_ERROR].forEach((event) => {
    logEvent(connection, event)
  });

  APP_SIGNALS.forEach((event) => {
    process.on(event, () => closeConnection(connection, () => {
      process.exit(0);
    }));
  });

  mongoose.connect(config.mongoDb.uri);
}


function closeConnection(connection, callback) {
  connection.close(() => {
    console.log('MongoDb: disconnected due to app being stopped');
    callback();
  });
}


function logEvent(connection, eventName, details='') {
  connection.on(eventName, () => {
    console.log('MongoDb:', eventName, details )
  });
}


module.exports = {
  init
};
