// controllers/dashboardController.js
const dashboardController = {
    // Show dashboard
    index: (req, res) => {
        const stats = {
            totalUsers: 1234,
            totalProducts: 567,
            revenue: '$45,678',
            orders: 890
        };

        const recentActivity = [
            { type: 'user', message: 'User baru mendaftar', time: '2 menit yang lalu', icon: 'fas fa-user', color: 'blue' },
            { type: 'order', message: 'Order baru diterima', time: '5 menit yang lalu', icon: 'fas fa-shopping-cart', color: 'green' },
            { type: 'product', message: 'Product baru ditambahkan', time: '10 menit yang lalu', icon: 'fas fa-box', color: 'yellow' },
            { type: 'alert', message: 'Stock produk menipis', time: '15 menit yang lalu', icon: 'fas fa-exclamation-triangle', color: 'red' }
        ];

        res.render('dashboard/index', {
            title: 'Dashboard',
            user: req.user,
            page: 'dashboard',
            stats: stats
        });
    },
    products: (req, res) => {
        res.render('products/index', {
            title: 'Products',
            user: req.user,
            page: 'products'
        });
    },
    gudangs: (req, res) => {
        res.render('gudang/index', {
            title: 'Gudang',
            user: req.user,
            page: 'gudang'
        });
    },
    opnames: (req, res) => {
        res.render('gudang/opname', {
            title: 'Stock Opname',
            user: req.user,
            page: 'opname'
        });
    }
};

module.exports = dashboardController;