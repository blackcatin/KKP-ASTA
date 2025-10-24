// ReportService.js
// Generated automatically

const knex = require('../config/database');

const ReportService = {
	getProfitAndLoss: async filters => {
		const query = knex('transactions')
			.join('transaction_types', 'transactions.transaction_type_id', 'transaction_types.id')
			.select(
				knex.raw(
					`SUM(CASE WHEN transaction_types.name = 'penjualan' THEN amount ELSE 0 END) AS total_penjualan`
				),
				knex.raw(
					`SUM(CASE WHEN transaction_types.name IN ('pembelian', 'operasional', 'gaji', 'pajak') THEN amount ELSE 0 END) AS total_biaya`
				)
			);

		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		}

		const [result] = await query;
		const laba_rugi =
			(parseFloat(result.total_penjualan) || 0) - (parseFloat(result.total_biaya) || 0);

		return {
			total_penjualan: result.total_penjualan || 0,
			total_biaya: result.total_biaya || 0,
			laba_rugi: laba_rugi || 0,
		};
	},

	getBudget: async filters => {
		const expenseTypes = await knex('transaction_types').where('flow', 'keluar').select('id');
		const expenseTypesId = expenseTypes.map(trx => trx.id);

		const query = knex('transactions')
			.select(
				'categories.name as category_name',
				knex.raw('SUM(transactions.amount) as total_pengeluaran')
			)
			.join('stock_movements', 'transactions.id', '=', 'stock_movements.transaction_id')
			.join('items', 'stock_movements.item_id', '=', 'items.id')
			.join('categories', 'items.category_id', '=', 'categories.id')
			.whereIn('transactions.transaction_type_id', expenseTypesId) // hanya pengel;uaran
			.groupBy('categories.name'); // kelompokkan berdasarkan nama katergori

		if (filters.start_date && filters.end_date) {
			const start = `${filters.start_date} 00:00:00`;
			const end = `${filters.end_date} 23:59:59`;
			query.whereBetween('transactions.created_at', [start, end]);
		}

		return query;
	},

	getCashFlow: async filters => {
		const query = knex('transactions')
			.join('transaction_types', 'transactions.transaction_type_id', 'transaction_types.id')
			.select(
				knex.raw(
					`COALESCE(SUM(CASE WHEN transaction_types.flow = 'masuk' THEN transactions.amount ELSE 0 END), 0) AS total_kas_masuk`
				),
				knex.raw(
					`COALESCE(SUM(CASE WHEN transaction_types.flow = 'keluar' THEN transactions.amount ELSE 0 END), 0) AS total_kas_keluar`
				)
			);

		if (filters.start_date && filters.end_date) {
			const start = `${filters.start_date} 00:00:00`;
			const end = `${filters.end_date} 23:59:59`;
			query.whereBetween('transactions.created_at', [start, end]);
		} else {
			query.whereRaw(
				"DATE_TRUNC('month', transactions.created_at) = DATE_TRUNC('month', CURRENT_DATE)"
			);
		}

		const [result] = await query;

		const total_kas_masuk = Number(result.total_kas_masuk) || 0;
		const total_kas_keluar = Number(result.total_kas_keluar) || 0;
		const arus_kas = total_kas_masuk - total_kas_keluar;

		return [
			{
				total_kas_masuk,
				total_kas_keluar,
				arus_kas,
			},
		];
	},
	// Fungsi untuk mendapatkan semua data
	getAll: async () => {
		// return knex('report').select('*');
		// Contoh join: return knex('tabel_utama').join('tabel_lain');
	},

	// Fungsi untuk mendapatkan data berdasarkan ID
	getById: async id => {
		// return knex('report').where({ id }).first();
	},

	// Fungsi untuk membuat data baru
	create: async data => {
		// return knex('report').insert(data).returning('*');
	},

	// Fungsi untuk memperbarui data
	update: async (id, data) => {
		// return knex('report').where({ id }).update(data);
	},

	// Fungsi untuk menghapus data
	del: async id => {
		// return knex('report').where({ id }).del();
	},
};

module.exports = ReportService;
