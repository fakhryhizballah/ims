'use strict';
const {
  Model
} = require('sequelize');
const tenan = require('./tenan');
module.exports = (sequelize, DataTypes) => {
  class Akses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Akses.belongsTo(models.User, { foreignKey: 'user_username' });
      Akses.hasOne(models.Tenan, {
        foreignKey: 'id',
        sourceKey: 'id_tenan',
        as: 'tenan'
      });
    }
  }
  Akses.init({
    user_username: DataTypes.STRING,
    id_tenan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Akses',
  });
  return Akses;
};