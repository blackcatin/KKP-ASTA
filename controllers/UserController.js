// UserController.js
const bcrypt = require('bcrypt');
const express = require('express');
const UserService = require('../services/UserService');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

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
		return res.status(200).json({message: 'Login Berhasil', user: user});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

// get all user
router.get(
	'/',
	authMiddleware.authMiddleware,
	authMiddleware.authorizeRole('owner'),
	async (req, res) => {
		try {
			const users = await UserService.getAllUsers(req.query.role);
			res.status(200).json({users});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	}
);

// create user
router.post(
	'/',
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
	}
);

// delete user
router.delete(
	'/:id',
	authMiddleware.authMiddleware,
	authMiddleware.authorizeRole('owner'),
	async (req, res) => {
		const {id} = req.params;
		try {
			await UserService.deleteUser(id);
			res.status(200).json({message: 'User berhasil dihapus'});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	}
);

// update user
router.put(
	'/:id',
	authMiddleware.authMiddleware,
	authMiddleware.authorizeRole('owner'),
	async (req, res) => {
		const {id} = req.params;
		const updateData = req.body;

		// validasi data tidak kosong
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({message: 'Tidak ada data yang diedit'});
		}

		try {
			const [updatedUser] = await UserService.updateUser(id, updateData);

			if (!updatedUser) {
				return res.status(404).json({message: 'Pengguna tidak ditemukan'});
			}

			res.status(200).json({
				message: 'Pengguna berhasil diperbarui',
				user: updatedUser,
			});
		} catch (error) {
			return res.status(500).json({message: 'Server error'});
		}
	}
);

module.exports = router;
