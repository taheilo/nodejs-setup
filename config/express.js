var express = require('express'),
    exphbs = require('express-handlebars'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    csrf = require('csurf'),
    helpers = require('view-helpers'),
    router = require('./routes'),
    config = require('./config');


module.exports = function(app, passport, db) {
  app.set('showStackError', true);

  // Init handlebars
  hbs = exphbs.create({
    defaultLayout: config.root + '/app/views/layouts/default',
    extname: '.html'
  });

  // Prettify HTML
  app.locals.pretty = true;

  // Should be placed before express.static
  app.use(compression({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  app.use(favicon(config.root + '/app/assets/favicon.ico'));
  app.use(express.static(config.root + '/app/assets'));

  // Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Set views path, template engine and default layout
  app.engine('.html', hbs.engine);
  app.set('views', config.root + '/app/views');
  app.set('view engine', '.html');


  // Enable jsonp
  app.enable('jsonp callback');

  // cookieParser should be above session
  app.use(cookieParser());

  // bodyParser should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(methodOverride());

  // express/mongo session storage
  app.use(session({
    secret: 'STBktRnmBOsmtYsckN9h',
    store: new mongoStore({
      db: db.connection.db,
      collection: 'sessions'
    }),
    saveUninitialized: true,
    resave: true
  }));

  // connect flash for flash messages
  app.use(flash());

  // dynamic helpers
  app.use(helpers(config.app.name));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Attach CSRF tokens to all requests
  app.use(csrf());

  app.use(function(req, res, next) {
    res.locals.token = req.csrfToken();
    next();
  });

  // routes should be at the last
  app.use(router);

  // Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    // Treat as 404
    if (~err.message.indexOf('not found')) return next();

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500).render('500', {
      error: err.stack
    });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
