'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Penerimaans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_barang: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATE
      },
      user: {
        type: Sequelize.STRING
      },
      satuan_besar: {
        type: Sequelize.DOUBLE
      },
      satuan_kecil: {
        type: Sequelize.DOUBLE
      },
      harga: {
        type: Sequelize.INTEGER
      },
      total_harga: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Penerimaans');
  }
};