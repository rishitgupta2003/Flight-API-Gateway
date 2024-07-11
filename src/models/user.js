'use strict';
const {
  Model
} = require('sequelize');
const { USER_ROLES_ENUMS, ApiError, Auth } = require("../utils");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES_ENUMS;
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../config");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: 'id',
        onDelete: 'CASCADE'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
          validate: {
            len: [3,10]
          }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, Number(ServerConfig.SALT_ROUNDS));
  })
  return User;
};