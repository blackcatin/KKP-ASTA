// UserController.js
const knex = require('../config/database');
const bcrypt = require('bcrypt');
const cryptRounds = 10;

exports.register = async (req, res) => {
	const {full_name, email, password, role} = req.body;
	if (!full_name || !email || !password || !role) {
		return res.status(400).json({message: 'Semua kolom harus diisi'});
	}

	try {
		const existingUser = await knex('users').where({email}).first();
		if (existingUser) {
			return res.status(409).json({message: 'Email sudah terdaftar'});
		}

		const hashedPassword = await bcrypt.hash(password, cryptRounds);

		await knex('users').insert({
			full_name,
			email,
			password_hash: hashedPassword,
			role,
		});
		res.status(201).json({message: 'Registrasi berhasil'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
};

exports.login = async (req, res) => {
	const {email, password} = req.body;

	if (!email || !password) {
		return res.status(400).json({message: 'Semua kolom harus diisi'});
	}

	try {
		const user = await knex('users').where({email}).first();
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

exports.index = async (req, res) => {
	res.send('User index');
};

exports.show = async (req, res) => {
	const {id} = req.params;
	res.send('User show ' + id);
};
