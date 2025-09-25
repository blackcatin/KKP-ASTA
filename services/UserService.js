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

	deleteUser: async id => {
		return knex('users').where({id}).del();
	},

	updateUser: async (id, data) => {
		const allowedFields = ['full_name', 'email', 'role'];
		// filter editable
		const updateData = Object.keys(data)
			.filter(key => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = data[key];
				return obj;
			}, {});

		const [updatedUser] = await knex('users')
			.where({id})
			.update(updateData)
			.returning(['id', 'full_name', 'email', 'role']);

		return updatedUser;
	},
};

module.exports = UserService;
