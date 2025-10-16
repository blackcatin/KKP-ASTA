// auth.js
const jwt = require('jsonwebtoken');
const knex = require('../config/database');

exports.authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({message: 'Token tidak ditemukan'});
		}

		const token = authHeader.split(' ')[1];
		const blacklisted = await knex('token_blacklist').where({token}).first();

		if (blacklisted) {
			return res.status(401).json({message: 'Token tidak valid (sudah logout)'});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;
		req.token = token;

		console.log('Token masuk:', token);
		console.log('Decoded:', decoded);

		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({message: 'Token tidak valid atau kadaluarsa'});
	}

	// req.user = {
	// 	id: 1,
	// 	role: 'owner',
	// };
};

exports.authorizeRole = requiredRole => (req, res, next) => {
	// cek role user
	if (req.user && req.user.role === requiredRole) {
		next();
	} else {
		res.status(403).json({message: 'Akses ditolak'});
	}
};
