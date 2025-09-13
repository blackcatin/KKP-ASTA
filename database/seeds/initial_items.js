/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
	await knex('items').insert([
		{item_name: 'Beras', category: 'bahan_dapur', current_stock: 100},
		{item_name: 'Minyak Goreng', category: 'bahan_dapur', current_stock: 50},
		{item_name: 'Sabun Cuci Piring', category: 'bahan_operasional', current_stock: 20},
	]);
};
