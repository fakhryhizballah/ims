# Inventory Management System (IMS)

## Project Overview
The Inventory Management System (IMS) is a full-stack application designed to manage inventory operations efficiently. It includes features for managing stock, tracking incoming goods, and maintaining historical records of stock movements. The application is built using modern web technologies and follows best practices for scalability and maintainability.

## Features
- **Stock Management**: View and update stock levels for various products.
- **Incoming Goods**: Record and track incoming goods with details like supplier, quantity, and price.
- **Stock History**: Maintain a detailed history of stock movements, including opname and penerimaan.
- **Search and Filters**: Search products and filter data by date, depot, and other criteria.
- **Responsive Design**: User-friendly interface optimized for both desktop and mobile devices.

## Technologies Used
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Frontend**: HTML, CSS, JavaScript, TailwindCSS
- **Database**: Relational database (e.g., MySQL/PostgreSQL)
- **Version Control**: Git

## Folder Structure
```
ims/
├── controllers/       # Backend controllers for handling API requests
├── models/            # Sequelize models for database tables
├── public/            # Static files (CSS, JS, images)
├── routes/            # API route definitions
├── views/             # EJS templates for rendering frontend pages
├── migrations/        # Database migration files
├── seeders/           # Database seed files
├── helpers/           # Utility functions
├── middleware/        # Middleware for authentication and other tasks
```

## Progress
### Completed
- **API Endpoints**:
  - Fetch stock data filtered by depot and tenant.
  - Record incoming goods (penerimaan).
  - Retrieve stock history (riwayat stok).
- **Frontend**:
  - Dynamic rendering of stock and incoming goods tables.
  - Search and filter functionality.
  - Date range picker for filtering data.
- **Database**:
  - Models for `Barang`, `Stok`, `RiwayatStok`, `Penerimaan`, and `Depo`.
  - Relationships between models established.

### In Progress
- **Testing**:
  - Manual testing of all implemented features.
  - Validation of API responses and frontend integration.
- **Enhancements**:
  - Improve error handling and user feedback.
  - Optimize database queries for better performance.

### To Do
- **Deployment**:
  - Set up production environment.
  - Deploy the application to a cloud platform.
- **Documentation**:
  - Complete API documentation.
  - Add usage instructions for end-users.

## How to Run
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Configure the database connection in `config/config.json`.
   - Run migrations:
     ```bash
     npx sequelize-cli db:migrate
     ```
   - Seed the database:
     ```bash
     npx sequelize-cli db:seed:all
     ```
4. Start the application:
   ```bash
   npm start
   ```
5. Open the application in your browser at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

## License
This project is licensed under the MIT License.
