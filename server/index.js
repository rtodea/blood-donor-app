const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const serverConfig = require('./config');
const dataSource = require('./datasource');
const socketIo = require('./socket-io');
const registerRoutes = require('./routes');


class AppBackend {

  constructor() {
    this.port = serverConfig.app.port;
    this.envType = serverConfig.app.envType;

    this.init();
  }

  init() {
    this._app = express();

    this._addLogger();
    this._addParserSupport();

    this._serveBuildFolder();
    this._createApiEndpoints();

    this._setupDbConnection();
    this._httpServer = http.Server(this._app);
    this._setupSocketIo();
  }

  _createApiEndpoints() {
    const router = express.Router();
    registerRoutes(router);
    this._app.use('/api', router);
  }

  _serveBuildFolder() {
    // TODO: remove this when introducing something
    // that will serve the static content (e.g. nginx)
    // this._app.get('/', (_, res) => {
    //   res.sendFile('build/index.html');
    // });
    this._app.use('/', express.static('build'));
  }

  _setupDbConnection() {
    dataSource.init();
  }

  _setupSocketIo() {
    socketIo.init(this._httpServer);
  }

  _addLogger() {
    if (['development', 'test'].includes(this.envType)) {
      this._app.use(morgan('dev'));
    }
  }

  _addParserSupport() {
    const plugins = [
      // Parse application/json
      bodyParser.json(),
      // Parse application/vnd.api+json as json
      bodyParser.json({type: 'application/vnd.api+json'}),
      // Parse application/x-www-form-urlencoded
      bodyParser.urlencoded({extended: true}),
      // Override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT    ]
      methodOverride('X-HTTP-Method-Override')
    ];

    plugins.forEach((plugin) => {
      this._app.use(plugin);
    });
  }

  start() {
    return this._httpServer.listen(this.port, () => {
      console.log('Backend services started and listening at port:', this.port);
    });
  }
}


module.exports = AppBackend;
