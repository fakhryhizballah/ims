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
      Penerimaan.hasOne(models.Barang, {
        as: 'barang',
        foreignKey: 'kode_barang',
        sourceKey: 'kode_barang'
      });
      Penerimaan.hasOne(models.RiwayatStok, {
        as: 'riwayatstok',
        foreignKey: 'id',
        sourceKey: 'riwayat_stok_id'
      });
      Penerimaan.hasOne(models.Supplier, {
        as: 'supplier',
        foreignKey: 'id',
        sourceKey: 'supplier_id'
      });
      Penerimaan.hasOne(models.Depo, {
        as: 'depo',
        foreignKey: 'id',
        sourceKey: 'depo_id'
      });

    }
  }
  Penerimaan.init({
    kode_barang: DataTypes.STRING,
    tanggal: DataTypes.DATEONLY,
    user: DataTypes.STRING,
    satuan_besar: DataTypes.DOUBLE,
    satuan_kecil: DataTypes.DOUBLE,
    harga: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER,
    user_username: DataTypes.STRING,
    depo_id: DataTypes.INTEGER,
    supplier_id: DataTypes.STRING,
    riwayat_stok_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Penerimaan',
  });
  return Penerimaan;
};