'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Depos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      depo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tenan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tenans', // Nama tabel referensi
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
    await queryInterface.dropTable('Depos');
  }
};