'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stok.hasOne(models.Barang, {
        as: 'barang',
        foreignKey: 'kode_barang',
        sourceKey: 'kode_barang'
      });
    }
  }
  Stok.init({
    kode_barang: DataTypes.STRING,
    depo_id: DataTypes.INTEGER,
    stok: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Stok',
  });
  return Stok;
};