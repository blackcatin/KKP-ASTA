// ItemService.js
// Generated automatically

const knex = require('../config/database');

const ItemService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async () => {
		return knex('items')
			.join('categories', 'items.category_id', '=', 'categories.id')
			.select(
				'items.id',
				'items.item_name',
				'items.category_id',
				'categories.name as category_name',
				'items.current_stock',
				'items.is_trackable'
			)
			.orderBy('item_name', 'asc');
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
	updateItem: async (id, data) => {
		const allowedFields = ['item_name', 'category_id', 'is_trackable'];
		const updateData = Object.keys(data)
			.filter(key => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = data[key];
				return obj;
			}, {});

		if (Object.keys(updateData).length === 0) {
			return null;
		}

		console.log(updateData);

		const updated = await knex('items')
			.where({id})
			.update(updateData)
			.returning(['item_name', 'category_id', 'is_trackable']);

		if (updated.length === 0) return null;

		return updated[0];
	},

	// Fungsi untuk menghapus data
	deleteItem: async id => {
		return knex('items').where({id}).del();
	},
};

module.exports = ItemService;
