var sequelize = require('../utils/db');
var Sequelize = require('sequelize');

var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
  	type: Sequelize.STRING
  },
  email_active: {
  	type: Sequelize.STRING
  }
});

module.exports = User;