/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('transactions');
	if (!exists) {
		return knex.schema.createTable('transactions', table => {
			table.increments('id').primary(); // PK
			table.integer('user_id').notNullable().unsigned(); // FK
			table.string('transaction_type', 50).notNullable(); // varchar(255) | UK
			table.text('description'); // text
			table.decimal('amount', 10, 2).notNullable(); // decimal
			table.string('nota_photo_url'); // URL foto kalo ada
			// FK
			table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

			table.timestamps(true, true); // created_at and updated_at
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('transactions');
};
