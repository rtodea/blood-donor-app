const R = require('ramda');
const path = require('path')

const ModelEvent = require('./models/model-event');
const Donor = require('./models/donor');

function dbModelToRestModel(persistedData, modelFields) {
  // We do not want the internals of MongoDB item to be exposed via REST endpoint
  return R.assoc('id', persistedData._id, R.pick(modelFields, persistedData));
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
    .put(({ params, body }, response) => {
      ModelObject.findOne({_id: params.id })
        .then((persistedData) => {
          if (persistedData === null) {
            response.status = 404;
            response.send({ message: 'Not found' });
          } else {
            Object.assign(persistedData, R.pick([modelFields], body));
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

function registerRoutes(router, socket) {
  router.get('/', (_, res) => (res.json({message: 'API v1'})));

  // TODO: add model routes
  // TODO: remove this
  registerRestEndpoints(router, 'model-event', ModelEvent.modelName, ['name'], ModelEvent, socket);

  // TODO: think of a better way to define the model fields accessible via REST
  registerRestEndpoints(router, 'donor', Donor.modelName, [
    'firstName', 'lastName', 'contactNo', 'email', 'bloodGroup',
    'longitude', 'latitude', 'ip', 'countryCode', 'street', 'city'
  ], Donor, socket);

  registerMapEndpoints(router);
}

function registerMapEndpoints(router) {
  router.get('/map/dump', (_, res) => {
    res.sendFile(path.join(__dirname, 'test/earthquake.csv'));
  });
}

module.exports = registerRoutes;
