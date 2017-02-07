const R = require('ramda');
const json2csv = require('json2csv');

const ModelEvent = require('./models/model-event');
const Donor = require('./models/donor');
const DONOR_FIELDS = [
  'firstName', 'lastName', 'contactNo', 'email', 'bloodGroup',
  'longitude', 'latitude', 'ip', 'countryCode', 'street', 'city'
];

function dbModelToRestModel(persistedData, modelFields) {
  // We do not want the internals of MongoDB item to be exposed via REST endpoint
  const restModel = {};
  modelFields.forEach((field) => {
    restModel[field] = persistedData[field];
  });
  restModel.id = persistedData._id;

  return restModel;
}

function onModelObjectError(modelName, response, error) {
  console.error(`${modelName}: ${error}`);
  response.send(error);
}

function registerRestEndpoints(router, resourceName, modelName, modelFields, ModelObject, socket) {
  // ## API object

  // HTTP Verb  Route                 Description

  // GET        /api/model             Get all of the model items
  // POST       /api/model             Create a single model item

  // GET        /api/model/:model_id    Get a single model item by model item id
  // DELETE     /api/model/:model_id    Delete a single model item
  // PUT        /api/model/:model_id    Update a model item with new info
  console.log('Registering REST Endpoints for:', modelName);

  const onCurrentModelObjectError = R.partial(onModelObjectError, [modelName]);
  router.route(`/${resourceName}`)
    .post(({ body }, response) => {
      ModelObject.create(R.pick(modelFields, body)).then((persistedData) => {
        console.debug(`${modelName} created: ${persistedData}`);
        const restModel = dbModelToRestModel(persistedData, modelFields);
        response.json(restModel);
        // TODO: do not couple the socket here
        if (socket) { socket.emit('create', restModel); }

      }).catch(R.partial(onCurrentModelObjectError, [response]));
    })
    .get((_, response) => {
      ModelObject.find()
        .then((models) => {
          response.json(
            models.map((persistedData => dbModelToRestModel(persistedData, modelFields)))
          );
        }).catch(R.partial(onCurrentModelObjectError, [response]));
    })
    // TODO: remove this afterwards
    // Just for easy testing
    .delete((_, response) => {
      let toBeDeletedModels;
      ModelObject.find()
        .then((models) => {
          toBeDeletedModels = models
        })
        .then(() => ModelObject.remove({}))
        .then(() => {
          response.json(
            toBeDeletedModels.map((persistedData => dbModelToRestModel(persistedData, modelFields)))
          );
        })
        .catch(R.partial(onCurrentModelObjectError, [response]))
    });

  router.route(`/${resourceName}/:id`)
    .get(({ params }, response) => {
      ModelObject.findOne({_id: params.id })
        .then((persistedData) => {
          if (persistedData === null) {
            response.status = 404;
            response.send({ message: 'Not found' });
          } else {
            response.json(dbModelToRestModel(persistedData, modelFields));
          }
        })
        .catch(R.partial(onCurrentModelObjectError, [response]));

    })
    .put((request, response) => {
      const { params, body } =  request;
      ModelObject.findOne({_id: params.id })
        .then((persistedData) => {
          if (persistedData === null) {
            response.status = 404;
            response.send({ message: 'Not found' });
          } else {
            modelFields.forEach(field => {
              persistedData[field] = body[field]; // because of proxied attributes
            });
            return persistedData.save();
          }
        })
        .then((updatedPersistedData) => {
          if (updatedPersistedData) {
            const restModel = dbModelToRestModel(updatedPersistedData, modelFields);
            response.json(restModel);
            if (socket) { socket.emit('update', restModel); }
          }
        })
        .catch(R.partial(onCurrentModelObjectError, [response]));
    })
    .delete(({ params }, response) => {
      ModelObject.remove({_id: params.id})
        .then(() => {
          response.json({ message: `Deleted ${params.id}` });
          if (socket) { socket.emit('delete', {id: params.id}); }
        })
        .catch(R.partial(onCurrentModelObjectError, [response]));
    });
}

function registerMapEndpoints(router) {
  console.log('Registering Custom Map Server: ', '/map/zoom/x/y.csv');
  router.get('/map/:z/:x/:y.csv', (_, res) => {
    res.set('Content-Type', 'text/csv');
    Donor.find().then(persistedDonors => {
      const csvFields = [].concat(DONOR_FIELDS, ['id']);
      res.send(json2csv({
        data: persistedDonors.map((persistedDonor) => dbModelToRestModel(persistedDonor, csvFields)),
        fields: csvFields,
        quotes: ''
      }));
    });
  });
}

function registerRoutes(router, socket) {
  router.get('/', (_, res) => (res.json({message: 'API v1'})));

  // TODO: add model routes
  // TODO: remove this
  registerRestEndpoints(router, 'model-event', ModelEvent.modelName, ['name'], ModelEvent, socket);

  // TODO: think of a better way to define the model fields accessible via REST
  registerRestEndpoints(router, 'donor', Donor.modelName, DONOR_FIELDS, Donor, socket);

  registerMapEndpoints(router);
}

module.exports = registerRoutes;
