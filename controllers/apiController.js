const { Tenan, Akses, Depo, Barang, JenisBarang, JenisSatuan, sequelize } = require('../models');
const { Op, where } = require('sequelize');
const { trimText, slugText } = require('../helpers');

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
                // attributes: ['slug', 'nama_satuan']
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
                await t.rollback();
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

    addDepo: async (req, res) => {
        try {
            const tenan = await Tenan.create(req.body);
            return res.status(200).json({ message: 'Success', data: tenan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = usersController;