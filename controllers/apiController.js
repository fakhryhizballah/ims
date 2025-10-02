const { Tenan, Akses, Depo, JenisSatuan } = require('../models');
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