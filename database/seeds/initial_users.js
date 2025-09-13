const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
	const hashedPasswordOwner = await bcrypt.hash('bismillah', 10);
	const hashedPasswordStaff = await bcrypt.hash('bismillah', 10);

	await knex('users').insert([
		{
			full_name: 'Owner A',
			email: 'owner@example.com',
			password_hash: hashedPasswordOwner,
			role: 'owner',
		},
		{
			full_name: 'Staff B',
			email: 'staff@example.com',
			password_hash: hashedPasswordStaff,
			role: 'staff',
		},
	]);
};
