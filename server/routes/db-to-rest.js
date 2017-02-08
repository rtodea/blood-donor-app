const R = require('ramda');

function dbModelToRestModel(persistedData, modelFields) {
  // We do not want the internals of MongoDB item to be exposed via REST endpoint
  const restModel = {};
  modelFields.forEach((field) => {
    restModel[field] = persistedData[field];
  });
  restModel.id = persistedData.id;

  return restModel;
}

function onModelObjectError(modelName, response, error) {
  console.error(`${modelName}: ${error}`);
  response.send(error);
}

function registerRestEndpoints(router, resourceName, modelName, modelFields, ModelObject, socket, socketEvents) {
  // ## API object
  //
  // HTTP VERB  ROUTE                   DESCRIPTION
  //
  // GET        /api/model              Get all of the model items
  // POST       /api/model              Create a single model item
  //
  // GET        /api/model/:model_id    Get a single model item by model item id
  // DELETE     /api/model/:model_id    Delete a single model item
  // PUT        /api/model/:model_id    Update a model item with new info
  console.log('Registering REST Endpoints for:', modelName);

  const onCurrentModelObjectError = R.partial(onModelObjectError, [modelName]);

  router.route(`/${resourceName}`)
    .post(post)
    .get(getAll)
    .delete(deleteAll); // // TODO: remove this afterwards as it is just for testing

  router.route(`/${resourceName}/:id`)
    .get(getId)
    .put(putId)
    .delete(deleteId);

  function post({ body }, response) {
    ModelObject.create(R.pick(modelFields, body)).then((persistedData) => {
      // console.log(`${modelName} created: ${persistedData}`);
      const restModel = dbModelToRestModel(persistedData, modelFields);
      response.json(restModel);
      // TODO: // Find a more elegant way to not couple the socket here
      if (socket) { socket.emit(socketEvents.create, restModel); }

    }).catch(R.partial(onCurrentModelObjectError, [response]));
  }

  function getId({ params }, response) {
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
  }

  function getAll(_, response) {
    ModelObject.find()
      .then((models) => {
        response.json(
          models.map((persistedData => dbModelToRestModel(persistedData, modelFields)))
        );
      }).catch(R.partial(onCurrentModelObjectError, [response]));
  }

  function deleteId({ params }, response) {
    ModelObject.remove({_id: params.id})
      .then(() => {
        response.json({ message: `Deleted ${params.id}` });
        if (socket) { socket.emit('delete', {id: params.id}); }
      })
      .catch(R.partial(onCurrentModelObjectError, [response]));
  }

  function deleteAll(_, response) {
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
  }

  function putId(request, response) {
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
          if (socket) { socket.emit(socketEvents.delete, restModel); }
        }
      })
      .catch(R.partial(onCurrentModelObjectError, [response]));
  }
}

module.exports = registerRestEndpoints;
