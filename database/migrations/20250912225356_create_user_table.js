/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const exists = await knex.schema.hasTable('users');
	if (!exists) {
		return knex.schema.createTable('users', table => {
			table.increments('id').primary(); // PK
			table.string('email', 255).notNullable().unique();
			table.string('full_name', 255).notNullable();
			table.string('password_hash', 255).notNullable();
			table.string('role', 50).notNullable;
			table.timestamps(true, true); // created_at and updated_at
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('users');
};
