const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Plug in NodeJS promise to avoid deprecation warnings

const config = require('./config');

const MONGOOSE_CONNECTED = 'connected';
const MONGOOSE_DISCONNECTED = 'disconnected';
const MONGOOSE_ERROR = 'error';

function init() {
  [
    MONGOOSE_CONNECTED,
    MONGOOSE_DISCONNECTED,
    MONGOOSE_ERROR
  ].forEach((event) => {
    logEvent(event)
  });

  mongoose.connect(config.mongoDb.uri);
}

function logEvent(eventName) {
  mongoose.connection.on(eventName, (details = '') => {
    console.log('MongoDB:', eventName, details)
  });
}

module.exports = {
  init
};
