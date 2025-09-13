const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('./knexfile');
const db = require('./config/database');
const userController = require('./controllers/UserController');

// Inisialisasi Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Run server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});

// Routes
app.get('/', (req, res) => {
	res.send('Backend Server is running.');
});

app.post('/api/register', userController.register);
app.post('/api/login', userController.login);
