const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const dashboardController = require('../controllers/dashboardController.js');
const { themeMiddleware, toggleTheme, setTheme } = require('../middleware/theme.js');
const { csrfToken } = require('../middleware/auth.js');

router.get('/login', csrfToken, authController.login);
router.get('/forgot', csrfToken, authController.forgotLogin);
router.post('/forgot', csrfToken, authController.processForgot);
router.post('/login', csrfToken, authController.processLogin);
router.get('/logout', authController.processLogout);
// router.get('/dashboard', requireAuth, themeMiddleware, dashboardController.index);

router.post('/api/theme/toggle', themeMiddleware, toggleTheme);
// API health check
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;