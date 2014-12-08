/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport');


/**
 * App configurations
 */
var env       = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config    = require('./config/config'),
    // auth    = require(''),
    mongoose  = require('mongoose');


/**
 * Database & Models
 */
var db = mongoose.connect(config.db),
    models_path = __dirname + '/app/models',
    walk = function(path) {
      fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
          if (/(.*)\.(js|coffee)/.test(file)) {
            require(newPath);
           }
        } else if (stat.isDirectory()) {
          walk(newPath);
        }
      })
    }

walk(models_path);

var app = express();

//express settings
require('./config/express')(app, passport, db);

//Bootstrap routes
// require('./config/routes')(app, passport, auth);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;
