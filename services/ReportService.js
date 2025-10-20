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

	// getCashFlow: async filters => {
	// 	const query = knex('transactions')
	// 		.join('transaction_types', 'transactions.transaction_type_id', 'transaction_types.id')
	// 		.select(
	// 			knex.raw(
	// 				`SUM(CASE WHEN transaction_types.flow = 'masuk' THEN amount ELSE 0 END) AS total_kas_masuk`
	// 			),
	// 			knex.raw(
	// 				`SUM(CASE WHEN transaction_types.flow = 'keluar' THEN amount ELSE 0 END) AS total_kas_keluar`
	// 			)
	// 		);

	// 	if (filters.start_date && filters.end_date) {
	// 		query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
	// 	} else {
	// 		query.whereRaw(
	// 			"DATE_TRUNC('month', transactions.created_at) = DATE_TRUNC('month', CURRENT_DATE)"
	// 		);
	// 	}

	// 	const [result] = await query;
	// 	const arus_kas =
	// 		(parseFloat(result.total_kas_masuk) || 0) - (parseFloat(result.total_kas_keluar) || 0);

	// 	return {
	// 		total_kas_masuk: formatCurrency(result.total_kas_masuk) || 0,
	// 		total_kas_keluar: formatCurrency(result.total_kas_keluar) || 0,
	// 		arus_kas: formatCurrency(arus_kas) || 0,
	// 	};
	// },

	getCashFlow: async filters => {
		const query = knex('transactions')
			.join('transaction_types', 'transactions.transaction_type_id', 'transaction_types.id')
			.select(
				knex.raw(`
        COALESCE(SUM(CASE WHEN transaction_types.flow = 'masuk' THEN transactions.amount ELSE 0 END), 0) AS total_kas_masuk
      `),
				knex.raw(`
        COALESCE(SUM(CASE WHEN transaction_types.flow = 'keluar' THEN transactions.amount ELSE 0 END), 0) AS total_kas_keluar
      `)
			);

		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		} else {
			query.whereRaw(
				"DATE_TRUNC('month', transactions.created_at) = DATE_TRUNC('month', CURRENT_DATE)"
			);
		}

		const [result] = await query;

		const total_kas_masuk = Number(result.total_kas_masuk) || 0;
		const total_kas_keluar = Number(result.total_kas_keluar) || 0;
		const arus_kas = total_kas_masuk - total_kas_keluar;

		return {
			total_kas_masuk,
			total_kas_keluar,
			arus_kas,
		};
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
