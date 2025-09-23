const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('auth/login', {
            title: 'Login',
            error: null
        });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple auth (replace with real authentication)
    if (username === 'admin' && password === 'admin') {
        req.session.user = { username: 'admin', name: 'Administrator' };
        res.redirect('/dashboard');
    } else {
        res.render('auth/login', {
            title: 'Login',
            error: 'Username atau password salah'
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard',
        user: req.session.user,
        page: 'dashboard'
    });
});

app.get('/users', requireAuth, (req, res) => {
    res.render('users/index', {
        title: 'Users',
        user: req.session.user,
        page: 'users'
    });
});

app.get('/products', requireAuth, (req, res) => {
    res.render('products/index', {
        title: 'Products',
        user: req.session.user,
        page: 'products'
    });
});

app.get('/reports', requireAuth, (req, res) => {
    res.render('reports/index', {
        title: 'Reports',
        user: req.session.user,
        page: 'reports'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});