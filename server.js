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
// Inisialisasi Express
const app = express();
const PORT = 3000;

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

// Run server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});
