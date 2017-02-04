function registerRoutes(appRouter) {
  // TODO: add model routes
  appRouter.route('/')
    .get((_, res) => {
      res.json({message: 'API v1'});
    })
}


module.exports = registerRoutes;
