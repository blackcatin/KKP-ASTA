/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return (
		knex.schema
			// modfikasi transaction
			.alterTable('transactions', table => {
				table.integer('transaction_type_id').unsigned();
			})
			// modifakasi items
			.alterTable('items', table => {
				table.integer('category_id').unsigned();
			})
			.then(() => {
				return knex('transactions').del();
			})
			.then(() => {
				return knex('items').del();
			})
			.then(() => {
				return knex.schema.alterTable('transactions', table => {
					table.integer('transaction_type_id').notNullable().alter();
					table.foreign('transaction_type_id').references('id').inTable('transaction_types');

					table.dropColumn('transaction_type');
				});
			})
			.then(() => {
				return knex.schema.alterTable('items', table => {
					table.integer('category_id').notNullable().alter();
					table.foreign('category_id').references('id').inTable('categories');
					table.dropColumn('category');
				});
			})
	);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema
		.alterTable('transactions', table => {
			table.string('transaction_type', 50);
			table.dropForeign('transaction_type_id');
			table.dropColumn('transaction_type_id');
		})
		.alterTable('items', table => {
			table.string('category', 50);
			table.dropForeign('category_id');
			table.dropColumn('category_id');
		});
};
