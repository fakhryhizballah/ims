const { Tenan, Akses, Depo, Stok, Barang, JenisBarang, JenisSatuan, Supplier, RiwayatStok, Penerimaan, sequelize } = require('../models');
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
                attributes: ['slug', 'nama_satuan']
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
                        kode_supplier: req.body.kode_supplier,
                        tenan_id: tenan_id
                    }
                });
            return res.status(200).json({
                status: 200,
                message: 'Success', data: vendor
            });
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
            let kode_depo = tenan_id + '-' + slugText(req.body.depo);
            const tenan = await Depo.create({
                tenan_id: tenan_id,
                kode_depo: kode_depo,
                depo: req.body.depo
            });
            return res.status(200).json({ message: 'Success', status: 200, data: tenan });

        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: `Depo "${req.body.depo}" sudah ada`, status: 400 });
            }
            res.status(500).json({ message: 'Internal Server Error', status: 500, data: error });
        }
    },
    getAllBarangWithStok: async (req, res) => {
        try {
            let tenan_id = req.cookies.selectedTenanId;
            // find depo id from kode_depo param
            let findDepo = await Depo.findOne({
                where: {
                    kode_depo: req.params.kode_depo,
                    tenan_id: tenan_id,
                    status: 1
                },
                attributes: ['id']
            });
            if (!findDepo) {
                return res.status(400).json({ message: 'Gudang tidak ditemukan' });
            }

            const barangs = await Barang.findAll({
                where: {
                    tenan_id: tenan_id,
                    status: 1
                },
                include: [
                    {
                        model: JenisBarang,
                        as: 'jenisbarang',
                        attributes: ['jenis_barang']
                    },
                    {
                        model: Stok,
                        as: 'stok',
                        where: { depo_id: findDepo.id },
                        required: false,
                        attributes: ['stok', 'depo_id']
                    }
                ],
                attributes: { exclude: ['id', 'tenan_id', 'createdAt', 'updatedAt'] },
                order: [['nama_barang', 'ASC']]
            });

            const data = barangs.map(b => {
                let item = b.toJSON();
                if (!item.stok) {
                    item.stok = 0;
                    item.stokGrups = 0;
                } else {
                    item.stok = item.stok.stok;
                    item.stokGrups = (item.isi && item.isi !== 0) ? (item.stok / item.isi) : 0;
                }
                return item;
            });

            return res.status(200).json({ message: 'Success', total: data.length, data: data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getStokByDepo: async (req, res) => {
        try {
            let tenan_id = req.cookies.selectedTenanId;
            let params = req.query;
            console.log(params);
            let findDepo = await Depo.findOne({
                where: {
                    kode_depo: req.params.kode_depo,
                    tenan_id: tenan_id,
                    status: 1
                },
                attributes: ['id']
            })
            if (!findDepo) {
                return res.status(400).json({ message: 'Gudang tidak ditemukan' });
            }
            const barang = await Barang.findOne({
                where:
                {
                    nama_barang: { [Op.like]: `${params.nama_barang}%` },
                    tenan_id: tenan_id,
                    status: 1
                },
                include: {
                    model: JenisBarang,
                    as: 'jenisbarang',
                    attributes: ['jenis_barang'],
                },
                attributes: { exclude: ['id', 'status', 'tenan_id', 'createdAt', 'updatedAt'] },
                limit: 1
            });
            if (!barang) {
                return res.status(400).json({
                    status: 400,
                    message: 'Barang tidak ditemukan',
                    data: barang
                });
            }
            let stok = await Stok.findOne({
                where: {
                    depo_id: findDepo.id,
                    kode_barang: barang.kode_barang
                }
            })
            if (!stok) {
                console.log(barang);
                barang.dataValues.stok = 0;
                barang.dataValues.stokGrups = 0;
            } else {
                barang.dataValues.stok = stok.stok;
                barang.dataValues.stokGrups = stok.stok / barang.isi;
            }
            return res.status(200).json({ status: 200, message: 'Success', data: barang });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    stokOpname: async (req, res) => {
        let t = await sequelize.transaction();
        try {
            const tenan_id = req.cookies.selectedTenanId;
            const kode_depo = req.params.kode_depo;
            const { kode_barang, stokRealKecil, stokRealBesar, status } = req.body;

            const findDepo = await Depo.findOne({
                where: { kode_depo: kode_depo, tenan_id: tenan_id, status: 1 },
                attributes: ['id']
            });
            if (!findDepo) {
                await t.rollback();
                return res.status(400).json({ message: 'Gudang tidak ditemukan' });
            }

            const barang = await Barang.findOne({ where: { kode_barang: kode_barang, tenan_id: tenan_id } });
            if (!barang) {
                await t.rollback();
                return res.status(400).json({ message: 'Barang tidak ditemukan' });
            }

            const newStokValue = Number(stokRealKecil) || 0;

            let stok = await Stok.findOne({ where: { depo_id: findDepo.id, kode_barang: kode_barang } });
            let stokAwal
            if (stok) {
                stokAwal = stok.stok;
                stok.stok = newStokValue;
                await stok.save({ transaction: t });
            } else {
                stokAwal = 0;
                stok = await Stok.create({ kode_barang: kode_barang, depo_id: findDepo.id, stok: newStokValue }, { transaction: t });
            }


            const masuk = newStokValue > stokAwal ? newStokValue - stokAwal : 0;
            const keluar = newStokValue < stokAwal ? stokAwal - newStokValue : 0;

            await RiwayatStok.create({
                kode_barang: kode_barang,
                tenan_id: tenan_id,
                stok_awal: stokAwal,
                masuk: masuk,
                keluar: keluar,
                status: status || 'opname',
                tanggal: new Date(),
                user_username: req.user.username,
                depo_id: findDepo.id
            }, { transaction: t });

            await t.commit();
            return res.status(200).json({ status: 200, message: 'Success', data: stok });
        } catch (error) {
            console.error(error);
            await t.rollback();
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    addPenerimaan: async (req, res) => {
        let t = await sequelize.transaction();
        try {
            const tenan_id = req.cookies.selectedTenanId;
            const { kode_barang, satuan_besar, satuan_kecil, harga, total_harga, supplier_id, depo_id, tanggal, penerima } = req.body;

            const barang = await Barang.findOne({ where: { kode_barang: kode_barang, tenan_id: tenan_id } });
            if (!barang) {
                await t.rollback();
                return res.status(400).json({ message: 'Barang tidak ditemukan' });
            }

            const depo = await Depo.findOne({ where: { id: depo_id, tenan_id: tenan_id, status: 1 } });
            if (!depo) {
                await t.rollback();
                return res.status(400).json({ message: 'Gudang tidak ditemukan' });
            }
            let stok = await Stok.findOne(
                { where: { depo_id: depo.id, kode_barang: kode_barang } },
                { transaction: t }
            );
            let oldStok = 0;
            if (stok) {
                oldStok = parseInt(stok.stok);
                stok.stok = oldStok + parseInt(satuan_kecil);
                await stok.save({ transaction: t });
            } else {
                stok = await Stok.create(
                    { kode_barang: kode_barang, depo_id: depo.id, stok: satuan_kecil || 0 },
                    { transaction: t }
                );
            }

            let riwayatStok = await RiwayatStok.create({
                kode_barang: kode_barang,
                tenan_id: tenan_id,
                stok_awal: oldStok,
                masuk: satuan_kecil || 0,
                keluar: 0,
                status: 'penerimaan',
                tanggal: tanggal || new Date(),
                user_username: req.user ? req.user.username : null,
                depo_id: depo.id
            }, { transaction: t });

            const penerimaan = await Penerimaan.create({
                kode_barang: kode_barang,
                tanggal: tanggal || new Date(),
                user: penerima,
                satuan_besar: satuan_besar || 0,
                satuan_kecil: satuan_kecil || 0,
                harga: harga,
                total_harga: total_harga,
                user_username: req.user.username,
                depo_id: depo.id,
                supplier_id: supplier_id,
                riwayat_stok_id: riwayatStok.id
            }, { transaction: t });

            await t.commit();
            return res.status(200).json({ message: 'Success', status: 200, data: penerimaan });
        } catch (error) {
            console.error(error);
            await t.rollback();
            res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getDataPenerima: async (req, res) => {
        try {
            const tenan_id = req.cookies.selectedTenanId;
            const { kode_barang, depo_id, start, end } = req.query;

            const whereConditions = {
            };

            if (kode_barang) {
                whereConditions.kode_barang = kode_barang;
            }

            if (depo_id) {
                whereConditions.depo_id = depo_id;
            }

            if (start && end) {
                whereConditions.tanggal = {
                    [Op.between]: [new Date(start), new Date(end)]
                };
            }

            const penerimaanData = await Penerimaan.findAll({
                where: whereConditions,
                include: [
                    {
                        model: Barang,
                        as: 'barang',
                        attributes: ['nama_barang', 'satuan_kecil', 'satuan_besar'],
                        include: {
                            model: JenisBarang,
                            as: 'jenisbarang',
                            attributes: ['jenis_barang']
                        }
                    },
                    {
                        model: Supplier,
                        as: 'supplier',
                        attributes: ['supplier']
                    },
                    {
                        model: Depo,
                        as: 'depo',
                        attributes: ['depo']
                    }
                ],
                // attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['tanggal', 'DESC']]
            });

            if (!penerimaanData || penerimaanData.length === 0) {
                return res.status(404).json({ message: 'Data penerimaan tidak ditemukan' });
            }

            return res.status(200).json({ message: 'Success', data: penerimaanData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    },
    getRiwayatStok: async (req, res) => {
        try {
            const tenan_id = req.cookies.selectedTenanId;
            const { kode_barang, depo_id, start, end } = req.query;

            const whereConditions = {
            };

            if (kode_barang) {
                whereConditions.kode_barang = kode_barang;
            }

            if (depo_id) {
                whereConditions.depo_id = depo_id;
            }

            if (start && end) {
                whereConditions.tanggal = {
                    [Op.between]: [new Date(start), new Date(end)]
                };
            }

            const riwayatStokData = await RiwayatStok.findAll({
                where: whereConditions,
                include: [
                    {
                        model: Barang,
                        as: 'barang',
                        attributes: ['nama_barang', 'satuan_kecil', 'satuan_besar'],
                        include: {
                            model: JenisBarang,
                            as: 'jenisbarang',
                            attributes: ['jenis_barang']
                        }
                    }
                ],
                // attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['tanggal', 'DESC']]
            });

            if (!riwayatStokData || riwayatStokData.length === 0) {
                return res.status(404).json({ message: 'Data riwayat stok tidak ditemukan' });
            }

            return res.status(200).json({ message: 'Success', data: riwayatStokData });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error', data: error });
        }
    }


};

module.exports = usersController;