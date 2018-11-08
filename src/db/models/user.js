'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "must be a valid email"} 
      },
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};