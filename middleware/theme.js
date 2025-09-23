// middleware/theme.js

// Theme middleware for dark/light mode
const themeMiddleware = (req, res, next) => {
    // Get theme from session or cookie, default to 'light'
    let theme = req.session.theme || req.cookies.theme || 'light';

    // Validate theme value
    if (!['light', 'dark'].includes(theme)) {
        theme = 'light';
    }

    // Set theme in response locals for views
    res.locals.theme = theme;
    res.locals.isDarkMode = theme === 'dark';

    next();
};

// API endpoint to toggle theme
const toggleTheme = (req, res) => {
    const currentTheme = req.session.theme || req.cookies.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Save theme in session and cookie
    req.session.theme = newTheme;
    res.cookie('theme', newTheme, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: false, // Allow JavaScript access for immediate UI updates
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.json({
        success: true, 
        theme: newTheme,
        message: `Switched to ${newTheme} mode`
    });
};

// API endpoint to set specific theme
const setTheme = (req, res) => {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid theme. Use "light" or "dark".' 
        });
    }

    // Save theme in session and cookie
    req.session.theme = theme;
    res.cookie('theme', theme, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    res.json({
        success: true, 
        theme: theme,
        message: `Theme set to ${theme} mode`
    });
};

module.exports = {
    themeMiddleware,
    toggleTheme,
    setTheme
};