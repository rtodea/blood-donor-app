const mongoose = require('mongoose');
// Plug in NodeJS promise
mongoose.Promise = global.Promise;

const config = require('./config');

const MONGOOSE_CONNECTED = 'connected';
const MONGOOSE_DISCONNECTED = 'disconnected';
const MONGOOSE_ERROR = 'error';

// TODO: revisit this
// const APP_INTERRUPTED = 'SIGINT';
// const APP_TERMINATED = 'SIGTERM';
// const APP_RESTARTED = 'SIGHUP';

// const APP_SIGNALS = [
//   APP_INTERRUPTED,
//   APP_TERMINATED,
//   APP_RESTARTED
// ];


function closeConnection(connection, callback) {
  connection.close(() => {
    console.log('MongoDb: disconnected due to app being stopped');
    callback();
  });
}


function init() {
  const connection = mongoose.connection;
  [MONGOOSE_CONNECTED, MONGOOSE_DISCONNECTED, MONGOOSE_ERROR].forEach((event) => {
    logEvent(connection, event)
  });

  // APP_SIGNALS.forEach((event) => {
  //   process.on(event, () => closeConnection(connection, () => {
  //     process.exit(0);
  //   }));
  // });

  mongoose.connect(config.mongoDb.uri);
}


function logEvent(connection, eventName) {
  connection.on(eventName, (details = '') => {
    console.log('MongoDb:', eventName, details)
  });
}


module.exports = {
  init
};
