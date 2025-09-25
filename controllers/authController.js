// controllers/authController.js
const { verifyOneTimeToken } = require('../middleware/auth.js');
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
        console.log(req.body);
        let verifyToken = verifyOneTimeToken(req.body._csrf);
        if (!verifyToken) {
            return res.redirect('/login');
        }

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
    }
};

module.exports = authController;