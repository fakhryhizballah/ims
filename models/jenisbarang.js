'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JenisBarang.init({
    id_tenan: DataTypes.INTEGER,
    kode_jenis: DataTypes.STRING,
    jenis_barang: DataTypes.STRING,
    status: DataTypes.ENUM('1', '0'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'JenisBarang',
  });
  return JenisBarang;
};