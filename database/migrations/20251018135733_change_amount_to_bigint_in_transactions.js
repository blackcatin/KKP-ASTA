/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	await knex.schema.alterTable('transactions', table => {
		table.bigint('amount').alter();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
	await knex.schema.alterTable('transactions', table => {
		table.integer('amount').alter();
	});
};
