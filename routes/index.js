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
router.get('/', verifyToken, (req, res) => {
    res.redirect('/dashboard');
})



router.post('/api/forgot/send-otp', authController.sendOTP);
router.get('/api/tenan', verifyToken, api.getTenan);
router.get('/api/barang/satuan', api.getSatuan);
router.get('/api/barang/jenis', verifyToken, api.getJenisBarang);
router.post('/api/barang', verifyToken, api.addBarang);
// API health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;