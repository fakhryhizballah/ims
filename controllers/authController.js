// controllers/authController.js
const authController = {
    // Show login page
    showLogin: (req, res) => {
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        res.render('auth/login', {
            title: 'Login',
            error: null
        });
    },

    // Process login
    processLogin: (req, res) => {
        const { username, password } = req.body;

        // Simple auth (replace with real authentication)
        if (username === 'admin' && password === 'admin') {
            req.session.user = {
                id: 1,
                username: 'admin',
                name: 'Administrator',
                role: 'admin'
            };
            return res.redirect('/dashboard');
        }

        res.render('auth/login', {
            title: 'Login',
            error: 'Username atau password salah'
        });
    },

    // Process logout
    processLogout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    }
};

module.exports = authController;