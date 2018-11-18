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
    }, 
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });
  };
  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  User.prototype.isStandard = function () {
    return this.role === "standard";
  };
  User.prototype.isPremium = function() {
    return this.role === "premium";
  };
  return User;
};