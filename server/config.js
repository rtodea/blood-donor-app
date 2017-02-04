const { config } = require('dotenv');
config({ silent: true });

module.exports = {
  mongoDb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/blood-donor"
  },
  app: {
    port: process.env.PORT || 3000,
    envType: process.env.NODE_ENV
  }
};
