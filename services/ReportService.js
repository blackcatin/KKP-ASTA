// ReportService.js
// Generated automatically

const knex = require('../config/database');

const ReportService = {
	getProfitAndLoss: async filters => {
		const query = knex('transactions').select(
			knex.raw('SUM(CASE WHEN transaction_type = ? THEN amount ELSE 0 END) as total_penjualan', [
				'penjualan',
			]),
			knex.raw(
				'SUM(CASE WHEN transaction_type IN (?, ?, ?, ?) THEN amount ELSE 0 END) as total_biaya',
				['pembelian', 'biaya_operasional', 'gaji', 'pajak']
			)
		);

		// filter berdasarkan tanggal
		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		}

		const [result] = await query;

		const laba_rugi = result.total_penjualan - result.total_biaya;

		return {
			total_penjualan: parseFloat(result.total_penjualan) || 0,
			total_biaya: parseFloat(result.total_biaya) || 0,
			laba_rugi: parseFloat(laba_rugi) || 0,
		};
	},

	getCashFlow: async filters => {
		const query = knex('transactions').select(
			knex.raw('SUM(CASE WHEN transaction_type = ? THEN amount ELSE 0 END) as total_kas_masuk', [
				'penjualan',
			]),
			knex.raw(
				'SUM(CASE WHEN transaction_type IN (?, ?, ?, ?) THEN amount ELSE 0 END) as total_kas_keluar',
				['pembelian', 'biaya_operasional', 'gaji', 'pajak']
			)
		);

		// filter berdasarkan tangga;
		if (filters.start_date && filters.end_date) {
			query.whereBetween('transactions.created_at', [filters.start_date, filters.end_date]);
		}

		const [result] = await query;

		const arus_kas = result.total_kas_masuk - result.total_kas_keluar;

		return {
			total_kas_masuk: parseFloat(result.total_kas_masuk) || 0,
			total_kas_keluar: parseFloat(result.total_kas_keluar) || 0,
			arus_kas: parseFloat(arus_kas) || 0,
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
