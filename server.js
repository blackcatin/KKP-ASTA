const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const database = require('./config/database');
const UserController = require('./controllers/UserController');
const TransactionController = require('./controllers/TransactionController');
const ItemController = require('./controllers/ItemController');
const ReportController = require('./controllers/ReportController');
const authMiddleware = require('./middleware/auth');
// Inisialisasi Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// === ROUTES ===
app.get('/', (req, res) => {
	res.send('Backend Server is running.');
});
app.post('/api/login', UserController.login);

app.post('/api/users', UserController.createUser);
app.get('/api/users', UserController.getAllUsers);

app.use('/api/transactions', TransactionController);
app.use('/api/items', ItemController);
app.use('/api/reports', ReportController);

// Run server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});
