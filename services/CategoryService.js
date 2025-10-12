// CategoryServiceService.js
// Generated automatically

const knex = require('../config/database');

const CategoryService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async () => {
		return knex('categories').select('id', 'name').orderBy('name', 'asc');
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('categoryservice').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	create: async name => {
		const [newCat] = await knex('categories').insert({name}.returning('*'));
		return newCat;
	},

	// Fungsi untuk memperbarui data
	update: async (id, name) => {
		const [updatedCat] = await knex('categories').where({id}).update({name}).returning('*');
		return updatedCat;
	},

	// Fungsi untuk menghapus data
	del: async id => {
		return knex('categoryservice').where({id}).del();
	},
};

module.exports = CategoryService;
