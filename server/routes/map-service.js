const json2csv = require("json2csv");
const { DonorModel, jsonifier } = require('../models/donor');

function registerMapEndpoints(router) {
  console.log('Registering Custom Map Server: ', '/map/zoom/x/y.csv');
  router.get('/map/:z/:x/:y.csv', (_, res) => {
    res.set('Content-Type', 'text/csv');

    DonorModel.find().then((persistedDonors) => (persistedDonors || []).map(jsonifier))
      .then((persistedDonors) => {
      res.send(json2csv({ data: persistedDonors, quotes: '' }));
    });
  });
}

module.exports = registerMapEndpoints;
