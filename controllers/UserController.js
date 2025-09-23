// UserController.js
const bcrypt = require('bcrypt');
const UserService = require('../services/UserService');
const authMiddleware = require('../middleware/auth');

exports.createUser = [
	authMiddleware.authMiddleware,
	authMiddleware.authorizeRole('owner'),
	async (req, res) => {
		const {full_name, email, password, role} = req.body;

		if (!full_name || !email || !password || !role) {
			return res.status(400).json({message: 'Semua kolom harus diisi'});
		}

		try {
			const newUser = await UserService.createUser(full_name, email, password, role);
			res.status(201).json({message: 'User berhasil dibuat', user: newUser});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	},
];

exports.login = async (req, res) => {
	const {email, password} = req.body;

	if (!email || !password) {
		return res.status(400).json({message: 'Semua kolom harus diisi'});
	}

	try {
		const user = await UserService.findUserByEmail(email);
		if (!user) {
			return res.status(400).json({message: 'Pengguna tidak ditemukan'});
		}

		const isMatch = await bcrypt.compare(password, user.password_hash);
		if (!isMatch) {
			return res.status(400).json({message: 'Password salah'});
		}

		delete user.password_hash;
		return res.status(200).json({message: 'Login Berhasil'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
};

exports.getAllUsers = [
	// authMiddleware.authMiddleware,
	// authMiddleware.authorizeRole('owner'),
	async (req, res) => {
		try {
			const users = await UserService.getAllUsers(req.query.role);
			res.status(200).json({users});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	},
];

exports.index = async (req, res) => {
	res.send('User index');
};

exports.show = async (req, res) => {
	const {id} = req.params;
	res.send('User show ' + id);
};
