const { Tenan, Akses, Depo, Barang, JenisBarang, JenisSatuan, Supplier, sequelize } = require('../models');
const { Op, where } = require('sequelize');
const { trimText, slugText } = require('../helpers');
const { DELETE } = require('sequelize/lib/query-types');
const depo = require('../models/depo');

const usersController = {
    // Show users list
    getTenan: async (req, res) => {
        try {
            console.log(req.user);
            const tenans = await Akses.findAll({
                where: {
                    user_username: req.user.username
                },
                include: {
                    model: Tenan,
                    as: 'tenan'
                }
            });
            let dataTenan = [];
            for (let i = 0; i < tenans.length; i++) {
                dataTenan.push(tenans[i].tenan);
            }
            return res.status(200).json({ message: 'Success', data: dataTenan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    getSatuan: async (req, res) => {
        try {
            const satuan = await JenisSatuan.findAll({
                attributes: [ 'slug', 'nama_satuan']
            });
            return res.status(200).json({ message: 'Success', data: satuan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }

    },
    getJenisBarang: async (req, res) => {
        try {
            const satuan = await JenisBarang.findAll({
                where: {
                    tenan_id: req.cookies.selectedTenanId
                },
                attributes: ['kode_jenis', 'jenis_barang']
            });
            return res.status(200).json({ message: 'Success', data: satuan });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    addBarang: async (req, res) => {
        let t = await sequelize.transaction();
        console.log(req.body);
        try {
            let tenan_id = req.cookies.selectedTenanId;
            let jenis_barang = trimText(req.body.jenis_barang);
            let nama_barang = trimText(req.body.nama_barang);
            console.log(tenan_id, jenis_barang, nama_barang);
            let slugJenis = tenan_id + '-' + slugText(jenis_barang);
            let slugBarang = tenan_id + '-' + slugText(nama_barang);
            let isexistBarang = await Barang.findOne({
                where: {
                    kode_barang: slugBarang
                }
            }, { transaction: t });
            if (isexistBarang) {
                await t.rollback(); x
                return res.status(400).json({ message: 'Barang sudah ada' });
            }
            let isexistJenisBarang = await JenisBarang.findOne({
                where: {
                    kode_jenis: slugJenis,
                }
            }, { transaction: t });
            if (!isexistJenisBarang) {
                await JenisBarang.create({
                    tenan_id: tenan_id,
                    kode_jenis: slugJenis,
                    jenis_barang: jenis_barang,
                }, { transaction: t });
            }

            if (!isexistBarang) {
                await Barang.create({
                    tenan_id: tenan_id,
                    kode_barang: slugBarang,
                    nama_barang: nama_barang,
                    jenis_barang: slugJenis,
                    satuan_besar: req.body.satuan_besar,
                    isi: req.body.kapasitas,
                    satuan_kecil: req.body.satuan_kecil,
                    harga: req.body.harga
                }, { transaction: t });
            }
            await t.commit();
            return res.status(200).json({ message: 'Success', data: tenan_id });

        } catch (error) {
            console.log(error);
            await t.rollback();
            return res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getBarang: async (req, res) => {
        try {
            let params = req.query;
            console.log(params);
            const barang = await Barang.findAll({
                where: [params,
                    { tenan_id: req.cookies.selectedTenanId },
                    { status: 1 }
                ],
                include: {
                    model: JenisBarang,
                    as: 'jenisbarang',
                    attributes: ['jenis_barang']
                },
                attributes: { exclude: ['id', 'tenan_id', 'createdAt', 'updatedAt'] },
                limit: 100,
            });
            let data_jenis = [...new Set(barang.map(item => item.jenis_barang))];
            return res.status(200).json({
                message: 'Success',
                total: {
                    barang: barang.length,
                    jenis: data_jenis.length
                },
                data: barang
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    cariBarang: async (req, res) => {
        try {
            let params = req.query;
            console.log(params);
            const barang = await Barang.findAll({
                where:
                {
                    nama_barang: { [Op.like]: `${params.nama_barang}%` },
                    jenis_barang: { [Op.like]: `${params.jenis_barang}%` },
                    tenan_id: req.cookies.selectedTenanId,
                    status: 1
                },
                include: {
                    model: JenisBarang,
                    as: 'jenisbarang',
                    attributes: ['jenis_barang']
                },
                attributes: { exclude: ['id', 'tenan_id', 'createdAt', 'updatedAt'] },
                limit: 100
            });
            if (barang.length <= 0) {
                return res.status(400).json({
                    message: 'Barang tidak ditemukan',
                    data: barang
                });
            }
            return res.status(200).json({ message: 'Success', data: barang });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getSupplier: async (req, res) => {
        try {
            const vendor = await Supplier.findAll({
                where: {
                    tenan_id: req.cookies.selectedTenanId,
                    status: 1
                },
                attributes: { exclude: ['status', 'tenan_id', 'createdAt', 'updatedAt'] }
            });
            if (vendor.length <= 0) {
                return res.status(400).json({
                    message: 'Supplier tidak ditemukan',
                    data: vendor
                });
            }
            return res.status(200).json({ message: 'Success', data: vendor });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    addSupplier: async (req, res) => {
        let t = await sequelize.transaction();
        try {
            if (!req.body.supplier) {
                t.rollback();
                return res.status(400).json({ message: 'Supplier harus diisi', status: 400 });
            }
            let slug = slugText(req.body.supplier);
            let tenan_id = req.cookies.selectedTenanId;
            console.log(tenan_id);
            const vendor = await Supplier.create({
                tenan_id: tenan_id,
                kode_supplier: tenan_id + '-' + slug,
                ...req.body
            }, { transaction: t });
            console.log(vendor);
            t.commit();
            return res.status(200).json({ message: 'Success', status: 200 });
        } catch (error) {
            t.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: `Supplier ${req.body.supplier} sudah ada`, status: 400 });
            }
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error', status: 500, data: error });
        }
    },
    updateSupplier: async (req, res) => {
        try {
            let tenan_id = req.cookies.selectedTenanId;
            let slug = slugText(req.body.supplier);
            const vendor = await Supplier.update({
                kode_supplier: tenan_id + '-' + slug,
                ...req.body
            },
                {
                    where: {
                        id: req.body.id,
                        tenan_id: tenan_id

                    }
                });
            return res.status(200).json({ message: 'Success', data: vendor });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: `Supplier ${req.body.supplier} sudah ada terjadi duplikasi` });
            }
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    deleteSupplier: async (req, res) => {
        try {
            let tenan_id = req.cookies.selectedTenanId;
            const vendor = await Supplier.update(
                {
                    status: '0'
                },
                {
                    where: {
                        id: req.body.id,
                        tenan_id: tenan_id
                    }
                });
            return res.status(200).json({ message: 'Success', data: vendor });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getGudang: async (req, res) => {
        try {
            const gudang = await Depo.findAll({
                where: {
                    tenan_id: req.cookies.selectedTenanId,
                    status: 1
                },
                attributes: { exclude: ['status', 'tenan_id', 'createdAt', 'updatedAt'] }
            });
            if (gudang.length <= 0) {
                return res.status(400).json({
                    message: 'Gudang tidak ditemukan',
                    data: gudang
                });
            }
            return res.status(200).json({ message: 'Success', data: gudang });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    addGudang: async (req, res) => {
        try {
            let tenan_id = req.cookies.selectedTenanId;
            const tenan = await Depo.create({
                tenan_id: tenan_id,
                depo: req.body.depo
            });
            return res.status(200).json({ message: 'Success', status: 200, data: tenan });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', status: 500, data: error });
        }
    },


};

module.exports = usersController;