const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './.env')});

module.exports = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || 5432,
			user: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_DATABASE || 'kkp_asta',
		},
		migrations: {
			directory: './database/migrations',
		},
		seeds: {
			directory: './database/seeds',
		},
	},

	production: {
		client: 'pg',
		connection: {
			connectionString: process.env.DATABASE_URL,
			ssl: {rejectUnauthorized: false},
		},
		migrations: {
			directory: './database/migrations',
		},
		seeds: {
			directory: './database/seeds',
		},
	},
};
