// middleware/auth.js

// Require authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

// Check if user is guest (not logged in)
const requireGuest = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    } else {
        return next();
    }
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).render('errors/403', {
            title: 'Access Forbidden',
            message: 'You do not have permission to access this resource.'
        });
    }
};

// Add user to locals for views
const addUserToLocals = (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
};

module.exports = {
    requireAuth,
    requireGuest,
    requireAdmin,
    addUserToLocals
};