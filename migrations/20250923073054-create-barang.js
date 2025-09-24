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
        primaryKey: true,
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
          model: {
            tableName: 'JenisBarangs'
          },
          key: 'kode_jenis' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      satuan_besar: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'JenisSatuans'
          },
          key: 'slug' // Mereferensikan kolom unik
        }
      },
      isi: {
        type: Sequelize.INTEGER
      },
      satuan_kecil: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'JenisSatuans'
          },
          key: 'slug' // Mereferensikan kolom unik
        }
      },
      harga: {
        type: Sequelize.INTEGER
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
        onDelete: 'RESTRICT'
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