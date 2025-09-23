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
            user: req.session.user,
            page: 'dashboard',
            stats: stats,
            recentActivity: recentActivity
        });
    }
};

module.exports = dashboardController;