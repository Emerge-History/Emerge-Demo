"use strict";
import config from '../config'


var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
const conf = config[config.env]
var sequelize = new Sequelize(conf.db.database, conf.db.username, conf.db.password, conf.db);
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
