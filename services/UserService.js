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
		return knex('users').where({email}).first();
	},
	getAllUsers: async role => {
		let query = knex('users').select('id', 'full_name', 'email', 'role');
		if (role) {
			query = query.where('role', role);
		}

		return query;
	},
};

module.exports = UserService;
