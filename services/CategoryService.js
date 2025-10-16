// CategoryServiceService.js
// Generated automatically

const {da} = require('@faker-js/faker');
const knex = require('../config/database');

const CategoryService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async () => {
		return knex('categories').select('id', 'name', 'description').orderBy('name', 'asc');
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('categoryservice').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	createCat: async name => {
		const [newCat] = await knex('categories').insert({name}.returning('*'));
		return newCat;
	},

	// Fungsi untuk memperbarui data
	updateCat: async (id, data) => {
		const allowedFields = ['name', 'description'];
		const updateData = Object.keys(data)
			.filter(key => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = data[key];
				return obj;
			}, {});

		if (Object.keys(updateData).length === 0) {
			return null;
		}

		const [updatedCat] = await knex('categories').where({id}).update(updateData).returning('*');
		return updatedCat;
	},

	// Fungsi untuk menghapus data
	deleteCat: async id => {
		return knex('categories').where({id}).del();
	},
};

module.exports = CategoryService;
