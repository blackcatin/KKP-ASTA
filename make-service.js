const fs = require('fs');
const path = require('path');

// Ambil nama service dari argumen terminal
const name = process.argv[2];
if (!name) {
	console.error('Namanya jangan lupa!');
	process.exit(1);
}

// Pastikan folder services ada
const servicesDir = path.join(__dirname, 'services');
if (!fs.existsSync(servicesDir)) {
	fs.mkdirSync(servicesDir);
}

// Nama service
const fileName = `${name}Service.js`;
const filePath = path.join(servicesDir, fileName);

// Template isi service
const template = `
// ${name}Service.js
// Generated automatically

const knex = require('../config/database');

const ${name}Service = {
  // Fungsi untuk mendapatkan semua data
  getAll: async () => {
    // return knex('${name.toLowerCase()}').select('*');
    // Contoh join: return knex('tabel_utama').join('tabel_lain');
  },

  // Fungsi untuk mendapatkan data berdasarkan ID
  getById: async (id) => {
    // return knex('${name.toLowerCase()}').where({ id }).first();
  },

  // Fungsi untuk membuat data baru
  create: async (data) => {
    // return knex('${name.toLowerCase()}').insert(data).returning('*');
  },

  // Fungsi untuk memperbarui data
  update: async (id, data) => {
    // return knex('${name.toLowerCase()}').where({ id }).update(data);
  },

  // Fungsi untuk menghapus data
  del: async (id) => {
    // return knex('${name.toLowerCase()}').where({ id }).del();
  }
};

module.exports = ${name}Service;
`;

// Cek jika file sudah ada
if (fs.existsSync(filePath)) {
	console.error(`Udah dipake namanya, Ganti!`);
	process.exit(1);
}

// Tulis file baru
fs.writeFileSync(filePath, template.trim());
console.log(`${fileName} Service berhasil dibuat`);
