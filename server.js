const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const database = require('./config/database');
const UserController = require('./controllers/UserController');
const TransactionController = require('./controllers/TransactionController');
const ItemController = require('./controllers/ItemController');
const ReportController = require('./controllers/ReportController');
const CategoryController = require('./controllers/CategoryController');
const authMiddleware = require('./middleware/auth');
const fs = require('fs');
// Inisialisasi Express
const app = express();
const PORT = 3000;
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, {recursive: true});
}

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Backend Server is running.');
});

app.use('/api/users', UserController);
app.use('/api/transactions', TransactionController);
app.use('/api/items', ItemController);
app.use('/api/reports', ReportController);
app.use('/api/categories', CategoryController);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Run server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});
