'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiwayatStoks', {
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
      tenan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Tenans'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      stok_awal: {
        type: Sequelize.DOUBLE
      },
      masuk: {
        type: Sequelize.DOUBLE
      },
      keluar: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.DATE
      },
      user_username: { // Nama kolom diubah
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'username'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      depo_id: {
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
    await queryInterface.dropTable('RiwayatStoks');
  }
};

