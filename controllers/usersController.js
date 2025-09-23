// controllers/usersController.js
const usersController = {
    // Show users list
    index: (req, res) => {
        const users = [
            {
                id: 1,
                name: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                role: 'Admin',
                status: 'Active',
                created: 'Jan 15, 2024',
                avatar: 'JD'
            },
            {
                id: 2,
                name: 'Jane Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                role: 'User',
                status: 'Active',
                created: 'Jan 12, 2024',
                avatar: 'JS'
            },
            {
                id: 3,
                name: 'Mike Johnson',
                username: 'mikejohnson',
                email: 'mike@example.com',
                role: 'User',
                status: 'Inactive',
                created: 'Jan 10, 2024',
                avatar: 'MJ'
            }
        ];

        res.render('users/index', {
            title: 'Users Management',
            user: req.session.user,
            page: 'users',
            users: users
        });
    },

    // Show create user form
    create: (req, res) => {
        res.render('users/create', {
            title: 'Add New User',
            user: req.session.user,
            page: 'users'
        });
    },

    // Process create user
    store: (req, res) => {
        // Process user creation logic here
        req.flash('success', 'User created successfully');
        res.redirect('/users');
    },

    // Show edit user form
    edit: (req, res) => {
        const userId = req.params.id;
        // Fetch user by ID logic here
        res.render('users/edit', {
            title: 'Edit User',
            user: req.session.user,
            page: 'users',
            userId: userId
        });
    },

    // Process update user
    update: (req, res) => {
        // Process user update logic here
        req.flash('success', 'User updated successfully');
        res.redirect('/users');
    },

    // Delete user
    destroy: (req, res) => {
        // Process user deletion logic here
        req.flash('success', 'User deleted successfully');
        res.redirect('/users');
    }
};

module.exports = usersController;