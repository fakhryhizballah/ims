'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penerimaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Penerimaan.init({
    kode_barang: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    user: DataTypes.STRING,
    satuan_besar: DataTypes.DOUBLE,
    satuan_kecil: DataTypes.DOUBLE,
    harga: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Penerimaan',
  });
  return Penerimaan;
};