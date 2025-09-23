'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Akses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_tenan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tenans',
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
    // Menambahkan index unik untuk pasangan id_user dan id_tenan
    await queryInterface.addIndex('akses', ['id_user', 'id_tenan'], {
      unique: true,
      name: 'user_tenan_access_unique'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Akses');
  }
};