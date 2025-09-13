// TransactionService.js
// Generated automatically

const knex = require('../config/database');

const TransactionService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async filters => {
		const query = kenx('transactions')
			.select('transactions.*', 'users.full_name as user__full_name')
			.join('users', 'transactions.user_id', '=', 'user.id');

		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		}

		query.orderBy('transactions.created_at', desc);

		return query;
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('transaction').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	create: async data => {
		return knex.transaction(async trx => {
			// simpan data transaksi
			const [newTransaction] = await trx('transactions')
				.insert({
					user_id: data.user_id,
					transaction_type: data.transaction_type,
					description: data.description,
					amount: data.amount,
				})
				.returning('*');

			// catat pergerakan stok
			if (data.items && data.items.length > 0) {
				for (const item of data.items) {
					const movementType = data.transaction_type === 'penjualan' ? 'out' : 'in';

					await trx('stock_movements').insert({
						item_id: item.id,
						transaction_id: newTransaction.id,
						movement_type: movementType,
						quantity: item.quantity,
					});

					// update stok
					const updateQuantity = movementType === 'out' ? -item.quantity : item.quantity;
					await trx('items').where({id: item.id}).increment('current_stock', updateQuantity);
				}
			}

			return newTransaction;
		});
	},

	// Fungsi untuk memperbarui data
	update: async (id, data) => {
		// return knex('transaction').where({ id }).update(data);
	},

	// Fungsi untuk menghapus data
	del: async id => {
		// return knex('transaction').where({ id }).del();
	},
};

module.exports = TransactionService;
