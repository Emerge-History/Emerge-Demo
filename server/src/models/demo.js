"use strict";

module.exports = function(sequelize, DataTypes) {
  var Demo = sequelize.define("Demo", {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Demo.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Demo;
};
