const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const routes = require('./routes');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// const client = createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_URL,
//         port: process.env.REDIS_URL_PORT
//     }
// });
// client.connect();
// client.on('connect', () => {
//     console.log('Redis client connected');
// });
// client.on('error', (err) => {
//     console.log('RedisSomething went wrong ' + err);
// });

app.use((req, res, next) => {
    // req.cache = client;
    next();
});

// Mount routes
app.use("/assets", express.static(path.join(__dirname + '/public/'), {
}));
app.use('/', routes);

// 404 Error handler
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/500', {
        title: 'Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong on our end.'
            : err.message
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});