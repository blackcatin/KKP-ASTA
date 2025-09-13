/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('table_name');
	if (!exists) {
		return knex.schema.createTable('table_name', table => {
			table.increments('id').primary(); // PK
			table.integer('user_id').unsigned().notNullable(); // FK
			table.string('name', 255).notNullable().unique(); // varchar(255) | UK
			table.text('description'); // text
			table.decimal('price', 14, 2).notNullable(); // decimal
			table.integer('stock').notNullable().defaultTo(0);
			table.timestamps(true, true); // created_at and updated_at
			
			// FK
			table.foreign('user_id').references('id').inTable('table_name').onDelete('CASCADE');
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('table_name');
};
