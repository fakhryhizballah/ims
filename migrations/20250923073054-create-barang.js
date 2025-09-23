'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Barangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode_barang: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      nama_barang: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jenis_barang: {
        type: Sequelize.STRING,
        references: {
          model: 'jenis_barangs',
          key: 'kode_jenis' // Mereferensikan kolom unik, bukan primary key
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      satuan_besar: {
        type: Sequelize.STRING,
        references: {
          model: 'jenis_satuans',
          key: 'nama_satuan' // Mereferensikan kolom unik
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      isi: {
        type: Sequelize.INTEGER
      },
      satuan_kecil: {
        type: Sequelize.INTEGER
      },
      harga: {
        type: Sequelize.INTEGER
      },
      tenan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tenans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('1', '0'),
        defaultValue: '1'
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
    await queryInterface.dropTable('Barangs');
  }
};