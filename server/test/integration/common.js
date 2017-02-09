const request = require('supertest');
const dotenv = require('dotenv');

const AppBackend = require('../../index');

function createDonor(emptierDonor = {}) {
  const fullDonor = {
    firstName: 'John',
    lastName: 'Doe',
    contactNo: '+40721231411',
    email: 'john.doe@acme.com',
    bloodGroup: 'O+',

    latitude: 45.75372,
    longitude: 21.22571,

    ip: '',
    countryCode: 'ROU',
    street: 'Piata Victoriei',
    city: 'Timisoara'
  };

  return Object.assign({}, fullDonor, emptierDonor);
}

function createServer() {
  dotenv.config({silent: true});

  if (process.env.TEST_SERVER_URL) {
    return request.agent(process.env.TEST_SERVER_URL);
  }

  const appBackend = new AppBackend();
  return request(appBackend._app);
}

module.exports = {
  createDonor,
  createServer
};
