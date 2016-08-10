var Sequelize = require('sequelize');
var config = require('../config');
var sequelize = new Sequelize(
	config.db_database,
	config.db_username,
	config.db_password,
	{
		'host': config.db_host,
		'port': config.db_port
	}
);

module.exports = sequelize;