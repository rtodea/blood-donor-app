const json2csv = require("json2csv");
const GeoJSON = require('geojson');

const { DonorModel, jsonifier, DONOR_REST_FIELDS } = require('../models/donor');

function registerMapEndpoints(router) {
  const fetchAllDonors = () => DonorModel.find().then(data => {
    return data.map(jsonifier);
  });

  registerDataFormatEndpoint(router, 'csv', 'text/csv', fetchAllDonors,
    (donorArray) => json2csv({ data: donorArray, quotes: '', fields: [].concat(DONOR_REST_FIELDS, ['id'])}),
    {});

  registerDataFormatEndpoint(router, 'geojson', 'application/json', fetchAllDonors,
    (donorArray) => GeoJSON.parse(donorArray, {Point: ['latitude', 'longitude']}),
    {});

}

function registerDataFormatEndpoint(router, formatName, mimeType, dataRetriever, formatter, filters) {
  console.log('Registering Custom Map Server: ', `/map/zoom/x/y.${formatName}`);
  router.get(`/map/:z/:x/:y.${formatName}`, (req, res) => {
    res.set('Content-Type', mimeType);

    // TODO: extend with some filter functionality
    // { filterName: predicate }
    let dataFilter;
    if (!(req.query.filter)) {
      dataFilter = () => true; // let everyone
    }

    dataRetriever()
      .then((data) => data.filter(dataFilter))
      .then((data) => {
        res.send(formatter(data));
      });
  });
}

module.exports = registerMapEndpoints;
