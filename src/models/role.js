'use strict';
const {
  Model
} = require('sequelize');

const { USER_ROLES_ENUMS } = require("../utils");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        foreignKey: 'role',
        onDelete: 'CASCADE'
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: USER_ROLES_ENUMS.CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};