const bcrypt = require('bcrypt');
const {faker} = require('@faker-js/faker');
faker.locale = 'id_ID';

exports.seed = async function(knex) {
	await knex('stock_movements').del();
	await knex('transactions').del();
	await knex('items').del();
	await knex('categories').del();
	await knex('transaction_types').del();
	await knex('users').del();
	// first order
	const hashedOwner = await bcrypt.hash('bismillah', 10);
	const [owner] = await knex('users')
		.insert([
			{full_name: 'Owner', email: 'owner@asta.com', password_hash: hashedOwner, role: 'owner'},
		])
		.returning('id');

	// dummy staff
	const dummyStaff = [];
	const staffPassword = await bcrypt.hash('staff123', 10);

	for (let i = 1; i <= 5; i++) {
		dummyStaff.push({
			full_name: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			password_hash: staffPassword,
			role: 'staff',
		});
	}
	await knex('users').insert(dummyStaff);

	// dummy tipe transaksi
	const typeResults = await knex('transaction_types')
		.insert([
			{name: 'penjualan', flow: 'masuk'},
			{name: 'pembelian', flow: 'keluar'},
			{name: 'pemakaian', flow: 'keluar'},
			{name: 'operasional', flow: 'keluar'},
			{name: 'gaji', flow: 'keluar'},
			{name: 'pajak', flow: 'keluar'},
			{name: 'pemasukan', flow: 'masuk'},
		])
		.returning(['id', 'name']);

	const typeMap = typeResults.reduce((acc, curr) => {
		acc[curr.name] = curr.id;
		return acc;
	}, {});

	// dummy kategori
	const categoryResults = await knex('categories')
		.insert([
			{name: 'Bahan Dapur'},
			{name: 'Operasional Kantor'},
			{name: 'Gaji Karyawan'},
			{name: 'Biaya Rutin Bulanan'},
		])
		.returning(['id', 'name']);

	const categoryMap = categoryResults.reduce((acc, curr) => {
		acc[curr.name] = curr.id;
		return acc;
	}, {});

	// dummy item
	const productNames = ['Beras', 'Mie', 'Gula', 'Tepung'];
	const operationalNames = ['Listrik Kantor', 'Langganan WiFi', 'Air Galon', 'Sewa Tempat'];

	const initialItems = [];
	productNames.forEach(name => {
		initialItems.push({
			item_name: name,
			category_id: categoryMap['Bahan Dapur'],
			current_stock: faker.number.int({min: 10, max: 100}), // stok acak
			is_trackable: true,
		});
	});

	operationalNames.forEach(name => {
		initialItems.push({
			item_name: name,
			category_id: categoryMap['Biaya Rutin Bulanan'],
			current_stock: 0,
			is_trackable: false,
		});
	});

	const insertedItems = await knex('items').insert(initialItems).returning(['id', 'item_name']);

	// map id untuk transakti
	const itemMap = insertedItems.reduce((acc, curr) => {
		acc[curr.item_name] = curr.id;
		return acc;
	}, {});

	// dummy transaction
	const dummyTransactions = [];

	for (let i = 0; i < 20; i++) {
		const transactionCategory = faker.helpers.arrayElement(['monetary', 'stock_only', 'expense']);
		// const isItemBased = faker.datatype.boolean();

		if (transactionCategory === 'monetary') {
			// transaksi penjualan/pembelian
			const typeName = faker.helpers.arrayElement(['penjualan', 'pembelian']);
			dummyTransactions.push({
				user_id: owner.id, // dibuat oleh owner
				transaction_type_id: typeMap[typeName],
				description:
					typeName === 'penjualan' ? `Transaksi Jual #${i + 1}` : `Invoice Beli #${i + 1}`,
				amount: faker.number.float({min: 10000, max: 500000, precision: 0.01}),
				nota_photo_url: faker.image.url(),
				created_at: faker.date.past(),
			});
		} else if (transactionCategory === 'stock_only') {
			// pemakaian stok
			dummyTransactions.push({
				user_id: owner.id,
				transaction_type_id: typeMap['pemakaian'],
				description: `Pemakaian item internal #${i + 1}`,
				amount: 0, // nominal rupiah nol
				nota_photo_url: '-',
				created_at: faker.date.past(),
			});
		} else {
			// transaksi biaya, gaji, dsb
			const typeName = faker.helpers.arrayElement(['operasional', 'gaji', 'pemasukan', 'pajak']);
			dummyTransactions.push({
				user_id: owner.id,
				transaction_type_id: typeMap[typeName],
				description: `${typeName} untuk bulan ${faker.date.month()}`,
				amount: faker.number.float({min: 50000, max: 2000000, precision: 0.01}),
				nota_photo_url: 'N/A',
				created_at: faker.date.past(),
			});
		}
	}

	await knex(['transactions']).insert(dummyTransactions);
};
