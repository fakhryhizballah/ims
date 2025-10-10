'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init({
    kode_supplier: DataTypes.STRING,
    supplier: DataTypes.STRING,
    tenan_id: DataTypes.INTEGER,
    alamat: DataTypes.STRING,
    nowa: DataTypes.STRING,
    status: DataTypes.ENUM('1', '0')
  }, {
    sequelize,
    modelName: 'Supplier',
  });
  return Supplier;
};