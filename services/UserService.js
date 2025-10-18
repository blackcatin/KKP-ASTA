// UserService.js
// Generated automatically

const knex = require('../config/database');
const bcrypt = require('bcrypt');

const UserService = {
	createUser: async (full_name, email, password, role) => {
		const hashedPassword = await bcrypt.hash(password, 10);
		const [user] = await knex('users')
			.insert({
				full_name,
				email,
				password_hash: hashedPassword,
				role,
			})
			.returning(['id', 'email', 'full_name', 'role']);
		return user;
	},

	findUserByEmail: async email => {
		return knex('users').select('id', 'full_name', 'password_hash', 'role').where({email}).first();
	},

	getAllUsers: async role => {
		let query = knex('users').select('id', 'full_name', 'email', 'role');
		if (role) {
			query = query.where('role', role);
		}

		return query;
	},

	deleteUser: async id => {
		return knex('users').where({id}).del();
	},

	updateUser: async (id, data) => {
		const allowedFields = ['full_name', 'email', 'role'];
		const updateData = {};

		// Masukkan hanya field yang diizinkan
		for (const key of allowedFields) {
			if (data[key] !== undefined && data[key] !== null) {
				updateData[key] = data[key];
			}
		}

		// Kalau ada password baru, hash dan tambahkan ke updateData
		if (data.password) {
			updateData.password_hash = await bcrypt.hash(data.password, 10);
		}

		// Eksekusi update
		const [updatedUser] = await knex('users')
			.where({id})
			.update(updateData)
			.returning(['id', 'full_name', 'email', 'role']);

		return updatedUser;
	},
};

module.exports = UserService;
