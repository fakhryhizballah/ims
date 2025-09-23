'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Akses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Akses.init({
    id_user: DataTypes.INTEGER,
    id_tenan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Akses',
  });
  return Akses;
};