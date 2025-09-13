// ItemService.js
// Generated automatically

const knex = require('../config/database');

const ItemService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async () => {
		return knex('items').select('*').orderBy('item_name', 'asc');
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('item').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	create: async data => {
		const [newItem] = await knex('items').insert(data).returning('*');
		return newItem;
	},

	// Fungsi untuk memperbarui data
	update: async (id, data) => {
		// return knex('item').where({ id }).update(data);
	},

	// Fungsi untuk menghapus data
	del: async id => {
		// return knex('item').where({ id }).del();
	},
};

module.exports = ItemService;
