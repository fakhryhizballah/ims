const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const dashboardController = require('../controllers/dashboardController.js');
const api = require('../controllers/apiController.js');
const { themeMiddleware, toggleTheme, setTheme } = require('../middleware/theme.js');
const { csrfToken, verifyCsrfToken, verifyToken } = require('../middleware/auth.js');

router.get('/login', authController.login);
router.get('/forgot', authController.forgotLogin);

router.post('/forgot', authController.processForgot);
router.post('/login', authController.processLogin);
router.get('/logout', authController.processLogout);
router.get('/dashboard', verifyToken, dashboardController.index);
router.get('/products', verifyToken, dashboardController.products);
router.get('/gudang', verifyToken, dashboardController.gudangs);
router.get('/gudang/opname', verifyToken, dashboardController.opnames);
router.get('/gudang/barangmasuk', verifyToken, dashboardController.barangMasuk);
router.get('/gudang/barangkeluar', verifyToken, dashboardController.barangKeluar);
router.get('/gudang/riwayatstok', verifyToken, dashboardController.riwayatStok);
router.get('/', verifyToken, (req, res) => {
    res.redirect('/dashboard');
})



router.post('/api/forgot/send-otp', authController.sendOTP);
router.get('/api/tenan', verifyToken, api.getTenan);
router.get('/api/barang/satuan', api.getSatuan);
router.get('/api/barang/category', verifyToken, api.getJenisBarang);
router.post('/api/barang', verifyToken, api.addBarang);
router.post('/api/barang/edit', verifyToken, api.editBarang);
router.get('/api/barang', verifyToken, api.getBarang);
router.get('/api/barang/cari', verifyToken, api.cariBarang);

router.get('/api/supplier', verifyToken, api.getSupplier);
router.post('/api/supplier', verifyToken, api.addSupplier);
router.put('/api/supplier', verifyToken, api.updateSupplier);
router.delete('/api/supplier', verifyToken, api.deleteSupplier);

router.get('/api/gudang', verifyToken, api.getGudang);
router.post('/api/gudang', verifyToken, api.addGudang);
router.get('/api/gudang/stok/:kode_depo', verifyToken, api.getStokByDepo);
router.get('/api/gudang/stokall/:kode_depo', verifyToken, api.getAllBarangWithStok);
router.post('/api/gudang/opname/:kode_depo', verifyToken, api.stokOpname);
router.post('/api/gudang/keluar/:kode_depo', verifyToken, api.barangKeluar);

router.post('/api/penerimaan/addPenerimaan', verifyToken, api.addPenerimaan);
router.get('/api/penerimaan/cari', verifyToken, api.getDataPenerima);

router.get('/api/riwayat/stok', verifyToken, api.getRiwayatStok);
// router.put('/api/gudang', verifyToken, api.updateGudang);
// router.delete('/api/gudang', verifyToken, api.deleteGudang);
// API health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;