/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('items');
	if (!exists) {
		return knex.schema.createTable('items', table => {
			table.increments('id').primary(); // PK
			table.string('item_name', 255).notNullable().unique();
			table.string('category', 50).notNullable();
			table.integer('current_stock').notNullable().defaultTo(0);
			table.timestamps(true, true); // created_at and updated_at
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('items');
};
