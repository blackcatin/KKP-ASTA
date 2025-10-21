// UserController.js
const bcrypt = require('bcrypt');
const express = require('express');
const UserService = require('../services/UserService');
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const router = express.Router();
const knex = require('../config/database');
const jwt = require('jsonwebtoken');

// login
router.post('/login', async (req, res) => {
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

		// JWT
		const accessToken = jwt.sign(
			{id: user.id, email: user.email, role: user.role},
			process.env.JWT_SECRET,
			{expiresIn: '6h'}
		);

		const refreshToken = jwt.sign(
			{id: user.id, email: user.email, role: user.role},
			process.env.JWT_REFRESH_SECRET,
			{expiresIn: '7d'}
		);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({message: 'Login Berhasil', user, accessToken, role: user.role});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.post('/refresh-token', async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return res.status(401).json({message: 'Refresh token tidak ditemukan'});
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		const newAccessToken = jwt.sign(
			{id: decoded.id, email: decoded.email},
			process.env.JWT_SECRET,
			{expiresIn: '15m'}
		);

		res.status(200).json({accessToken: newAccessToken});
	} catch (error) {
		console.error(error);
		res.status(403).json({message: 'Refresh token tidak valid atau kadaluarsa'});
	}
});

router.post('/logout', authMiddleware, async (req, res) => {
	try {
		const token = req.token;
		// blacklist
		await knex('token_blacklist').insert({token});
		// hapus cookis
		res.clearCookie('refreshToken');

		res.status(200).json({message: 'Logout berhasil'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

// get all user
router.get('/', authMiddleware, authorizeRole('owner'), async (req, res) => {
	try {
		const users = await UserService.getAllUsers(req.query.role);
		res.status(200).json({users});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

// create user
router.post('/', authMiddleware, authorizeRole('owner'), async (req, res) => {
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
});

// delete user
router.delete('/:id', authMiddleware, authorizeRole('owner'), async (req, res) => {
	const {id} = req.params;
	try {
		await UserService.deleteUser(id);
		res.status(200).json({message: 'User berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.get('/me', authMiddleware, (req, res) => {
	res.status(200).json({user: req.user});
});

// update user
router.put('/:id', authMiddleware, authorizeRole('owner'), async (req, res) => {
	const {id} = req.params;
	const updateData = req.body;

	// validasi data tidak kosong
	if (Object.keys(updateData).length === 0) {
		return res.status(400).json({message: 'Tidak ada data yang diedit'});
	}

	try {
		const updatedUser = await UserService.updateUser(id, updateData);

		if (!updatedUser) {
			return res.status(404).json({message: 'Pengguna tidak ditemukan'});
		}

		res.status(200).json({
			message: 'Pengguna berhasil diperbarui',
			user: updatedUser,
		});
	} catch (error) {
		console.error('Update user error:', error);
		return res.status(500).json({message: 'Server error', error: error.message});
	}
});

module.exports = router;
