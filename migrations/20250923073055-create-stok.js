'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stoks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_barang: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: {
            tableName: 'Barangs'
          },
          key: 'kode_barang'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      depo_id: { // Nama kolom diubah menjadi depo_id agar lebih jelas
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Depos'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      stok: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('Stoks');
  }
};

