'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisSatuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JenisSatuan.init({
    nama_satuan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JenisSatuan',
  });
  return JenisSatuan;
};