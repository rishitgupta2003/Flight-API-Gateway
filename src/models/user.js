'use strict';
const {
  Model
} = require('sequelize');
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
      this.belongsToMany(
        models.Role, 
        { through : 'UserRoles' , as : 'role' }
      );
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
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};


User.beforeCreate((user) => {
  user.password = bcrypt.hashSync(user.password, ServerConfig.SALT_ROUNDS);
})