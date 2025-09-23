'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Depo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Depo.init({
    depo: DataTypes.STRING,
    tenan_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Depo',
  });
  return Depo;
};