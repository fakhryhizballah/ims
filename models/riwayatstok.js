'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiwayatStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RiwayatStok.hasOne(models.Barang, {
        as: 'barang',
        foreignKey: 'kode_barang',
        sourceKey: 'kode_barang'
      })

    }
  }
  RiwayatStok.init({
    kode_barang: DataTypes.STRING,
    tenan_id: DataTypes.INTEGER,
    stok_awal: DataTypes.DOUBLE,
    masuk: DataTypes.DOUBLE,
    keluar: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    tanggal: DataTypes.DATEONLY,
    user_username: DataTypes.STRING,
    depo_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RiwayatStok',
  });
  return RiwayatStok;
};