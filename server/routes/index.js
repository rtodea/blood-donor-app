const registerRestEndpoints = require('./db-to-rest');
const registerMapEndpoints = require('./map-service');

const {
  DonorModel,
  DONOR_REST_FIELDS,
  DONOR_CREATE_EVENT,
  DONOR_DELETE_EVENT
} = require('../models/donor');

function registerRoutes(router, socket) {
  // Info about API version
  router.get('/', (_, res) => (
    res.json({
      message: 'API v1',
      version: '1'
    })
  ));

  // TODO: think of a better way to define the model fields accessible via REST
  registerRestEndpoints(
    router,
    'donor',
    DonorModel.modelName,
    DONOR_REST_FIELDS,
    DonorModel,
    socket,
    socketEvents = {
      create: DONOR_CREATE_EVENT,
      delete: DONOR_DELETE_EVENT
    });

  registerMapEndpoints(router);
}

module.exports = registerRoutes;
