// TransactionService.js
// Generated automatically

const knex = require('../config/database');

const TransactionService = {
	// Fungsi untuk mendapatkan semua data
	getAll: async filters => {
		const query = knex('transactions')
			.join('transaction_types', 'transactions.transaction_type_id', 'transaction_types.id')
			.join('users', 'transactions.user_id', 'users.id')
			.select(
				'transactions.id',
				'transactions.description',
				'transactions.amount',
				'transactions.nota_photo_url',
				'transaction_types.name as type_name',
				'transaction_types.flow as type_flow',
				'transactions.created_at',
				'users.full_name as user_full_name'
			)
			.orderBy('transactions.created_at', 'desc');

		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		}

		const transactions = await query;

		const movements = await knex('stock_movements')
			.join('items', 'stock_movements.item_id', 'items.id')
			.select(
				'stock_movements.transaction_id',
				'items.item_name as item_name',
				'stock_movements.quantity'
			);

		const result = transactions.map(trx => ({
			...trx,
			items: movements.filter(mov => mov.transaction_id === trx.id),
		}));

		return result;
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('transaction').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	create: async data => {
		return knex.transaction(async trx => {
			// simpan data transaksi
			const typeRow = await trx('transaction_types').where({name: data.transaction_type}).first();

			if (!typeRow) throw new Error('Tipe transaksi tidak ditemukan');

			const [newTransaction] = await trx('transactions')
				.insert({
					user_id: data.user_id,
					transaction_type_id: typeRow.id,
					description: data.description,
					amount: data.amount || 0,
					nota_photo_url: data.nota_photo_url || null,
				})
				.returning('*');

			// catat pergerakan stok
			if (data.items && data.items.length > 0) {
				for (const item of data.items) {
					let movementType;
					if (data.transaction_type === 'penjualan' || data.transaction_type === 'pemakaian') {
						movementType = 'out';
					} else if (data.transaction_type === 'pembelian') {
						movementType = 'in';
					} else {
						movementType = null;
					}

					await trx('stock_movements').insert({
						item_id: item.itemId,
						transaction_id: newTransaction.id,
						movement_type: movementType,
						quantity: item.quantity,
					});

					// update stok
					if (movementType) {
						const updateQuantity = movementType === 'out' ? -item.quantity : item.quantity;
						await trx('items').where({id: item.itemId}).increment('current_stock', updateQuantity);
					}
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
