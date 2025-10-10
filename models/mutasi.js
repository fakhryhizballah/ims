'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mutasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mutasi.init({
    riawariwayat_stok_id: DataTypes.STRING,
    metode: DataTypes.STRING,
    catatan: DataTypes.STRING,
    tenan_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('1', '0')
  }, {
    sequelize,
    modelName: 'Mutasi',
  });
  return Mutasi;
};