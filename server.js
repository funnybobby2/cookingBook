// Server entry point
// =========================
const chalk = require('chalk'); // to have pretty colorful logs in the console
const express = require('express');
const mongoose = require('mongoose'); // to easily manage mongoDB
const bodyParser = require('body-parser'); // Analyzes incoming request bodies in a middleware before our managers (req.body)
const methodOverride = require('method-override'); // allows use of HTTP verbs such as PUT or DELETE in places where the client does not support it
const createLogger = require('morgan'); // to log
require('dotenv').config(); // get the environnement variables
// const csrfProtect = require('csurf'); // Create a middleware for CSRF token creation and validation (Node.js CSRF protection middleware)

// Connection to mongoDB
const options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
const mongoPath = ((process.env.DB_USER === undefined) || (process.env.DB_PASS === undefined) || (process.env.DB_SERVER === undefined)) ? 'mongodb://localhost/menus' : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`;
mongoose.connect(mongoPath, options);

// indicates if the connection failed because it's painful to diagnose
const database = mongoose.connection;
database.on('error', () => {
  console.error(chalk`{red ✘ CANNOT CONNECT TO mongoDB DATABASE menus!}`);
});

// We export a registration function of a successful login callback,
// if it interests the caller (`index.js` uses it to log that the connection is ready)
const listenToConnectionOpen = function (onceReady) {
  if (typeof onceReady === 'function') {
    database.on('open', onceReady);
  }
};

// Connection to DB
listenToConnectionOpen(() => {
  console.log(chalk`{green ✔ Connection established to mongoDB database}`);

  database.db.listCollections().toArray((err) => {
    if (err) console.log(err);
  });

  // Configuration & middleware for all environments (dev, prod,...)
  const PORT = Number(process.env.PORT) || 8080;

  // Creates the main web app container (`app`), connects the HTTP server to it (` index`)
  // and determines the full path of the static assets
  const app = express();
  app.use(express.static('dist'));
  const isDev = app.get('env') === 'development';
  app.use(createLogger(isDev ? 'dev' : 'combined'));

  app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()); // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
  // app.use(methodOverride(req => req.body._method));
  app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

  // app.use(csrfProtect());

  // routes ======================================================================

  app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/dist/index.html`);
  });
  require('./src/routes')(app);

  // Effective server launch by listening on the correct port for incoming HTTP connections.
  app.listen(PORT, () => { console.log(chalk`{green ✔ Server listening on port} {cyan ${PORT}}`); });
});
