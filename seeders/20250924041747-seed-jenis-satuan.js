'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('JenisSatuans', [
      {
        slug: 'pcs',
        nama_satuan: 'Pcs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'box',
        nama_satuan: 'Box',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'pack',
        nama_satuan: 'Pack',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'set',
        nama_satuan: 'Set',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'roll',
        nama_satuan: 'Roll',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'bundel',
        nama_satuan: 'Bundel',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'bks',
        nama_satuan: 'Bungkus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'kg',
        nama_satuan: 'Kilogram',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'ltr',
        nama_satuan: 'Liter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'btl',
        nama_satuan: 'Botol',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
