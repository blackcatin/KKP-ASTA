/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('stock_movements');
	if (!exists) {
		return knex.schema.createTable('stock_movements', table => {
			table.increments('id').primary(); // PK
			table.integer('item_id').notNullable().unsigned(); // FK
			table.integer('transaction_id').notNullable().unsigned(); // FK
			table.string('movement_type', 20).notNullable();
			table.integer('quantity').notNullable();
			// FK
			table.foreign('item_id').references('id').inTable('items').onDelete('CASCADE');
			table.foreign('transaction_id').references('id').inTable('transactions').onDelete('CASCADE');
			table.timestamps(true, true); // created_at and updated_at
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('stock_movements');
};
