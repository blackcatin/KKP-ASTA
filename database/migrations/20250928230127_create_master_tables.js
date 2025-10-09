/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('transaction_types');
	if (!exists) {
		await knex.schema.createTable('transaction_types', table => {
			table.increments('id').primary;
			table.string('name', 50).notNullable().unique(); // contoh: penjualan, gaji, sumbahangan
			table.enum('flow', ['masuk', 'keluar', 'transfer']).notNullable(); // arah uang
			table.timestamps(true, true);
		});
	}

	const exists2 = await knex.schema.hasTable('categories');
	if (!exists2) {
		await knex.schema.createTable('categories', table => {
			table.increments('id').primary;
			table.string('name', 50).notNullable().unique(); // contoh: bahan dapur, biaya rutin, gaji
			table.timestamps(true, true);
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTable('transaction_types').dropTable('categories');
};
