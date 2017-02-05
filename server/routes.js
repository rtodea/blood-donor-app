function registerRoutes(router) {
  // TODO: add model routes
  router.get('/', (_, res) => (res.json({message: 'API v1'})));

  router.post('/event', () => {

  });
}


module.exports = registerRoutes;
