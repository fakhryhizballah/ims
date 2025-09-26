// controllers/authController.js
const { User, sequelize } = require("../models");
const authController = {
    // Show login page
    login: (req, res) => {
        const r = req.csrfToken;
        res.render('auth/login', {
            csrfToken: r,
            title: 'Login',
            error: null
        });
    },

    // Process login
    processLogin: (req, res) => {
        const { username, password } = req.body;

        // Check if the username and password are correct
        res.render('auth/login', {
            title: 'Login',
            csrfToken: req.csrfToken,
            error: 'Username atau password salah'
        });
    },
    forgotLogin: (req, res) => {
        res.render('auth/forgot', {
            title: 'lupa password',
            csrfToken: req.csrfToken,
            error: null
        });
    },
    processForgot: (req, res) => {
        return res.redirect('/login');
    },

    // Process logout
    processLogout: (req, res) => {

        res.redirect('/login');
    },
    sendOTP: (req, res) => {
        let { nowa } = req.body;
        nowa = nowa.replace(/[^0-9]/g, '');
        req.session.nowa = nowa;
        return res.status(200).json({
            error: false,
            message: nowa,
        });
    }
};

module.exports = authController;