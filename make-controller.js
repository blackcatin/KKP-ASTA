const fs = require('fs');
const path = require('path');

// ambil nama controller dari argumen terminal
const name = process.argv[2];
if (!name) {
	console.error('Namanya jangan lupa!');
	process.exit(1);
}

// pastikan folder controllers ada
const controllersDir = path.join(__dirname, 'controllers');
if (!fs.existsSync(controllersDir)) {
	fs.mkdirSync(controllersDir);
}

// nama controller
const fileName = `${name}Controller.js`;
const filePath = path.join(controllersDir, fileName);

// template isi controller
const template = `
// ${name}Controller.js
// Generated automatically

exports.index = async (req, res) => {
  res.send("${name} index");
};

exports.show = async (req, res) => {
  const { id } = req.params;
  res.send("${name} show " + id);
};

exports.create = async (req, res) => {
  res.send("${name} create");
};

exports.update = async (req, res) => {
  const { id } = req.params;
  res.send("${name} update " + id);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  res.send("${name} delete " + id);
};
`;

// cek kalo file udah ada
if (fs.existsSync(filePath)) {
	console.error(`Udah dipake namanya, Ganti!`);
	process.exit(1);
}

// tulis file baru
fs.writeFileSync(filePath, template.trim());
console.log(`${fileName} Controller berhasil dibuat`);

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
