'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Barang.init({
    kode_barang: DataTypes.STRING,
    nama_barang: DataTypes.STRING,
    jenis_barang: DataTypes.STRING,
    satuan_besar: DataTypes.STRING,
    isi: DataTypes.INTEGER,
    satuan_kecil: DataTypes.INTEGER,
    harga: DataTypes.INTEGER,
    tenan_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('1', '0')
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};