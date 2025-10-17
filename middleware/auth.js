// auth.js
const jwt = require('jsonwebtoken');
const knex = require('../config/database');

exports.authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		let token;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.split(' ')[1];
		} else if (req.query.token) {
			token = req.query.token;
		}

		if (!token) {
			return res.status(401).json({message: 'Token tidak ditemukan', code: 'NO_TOKEN'});
		}

		const blacklisted = await knex('token_blacklist').where({token}).first();
		if (blacklisted) {
			return res
				.status(401)
				.json({message: 'Token tidak valid (sudah logout)', code: 'BLACKLISTED'});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.user = decoded;
		req.token = token;

		console.log('✅ Token valid:', token);
		console.log('🧩 Decoded payload:', decoded);

		next();
	} catch (error) {
		console.error('❌ Auth error:', error);

		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({message: 'Token kadaluarsa', code: 'TOKEN_EXPIRED'});
		}

		return res.status(401).json({message: 'Token tidak valid', code: 'INVALID_TOKEN'});
	}
};

exports.authorizeRole = requiredRole => (req, res, next) => {
	// cek role user
	if (req.user && req.user.role === requiredRole) {
		next();
	} else {
		res.status(403).json({message: 'Akses ditolak'});
	}
};
