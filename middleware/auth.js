exports.authMiddleware = (req, res, next) => {
	// cek user has login?
	req.user = {
		id: 1,
		role: 'owner',
	};

	next();
};

exports.authorizeRole = requiredRole => (req, res, next) => {
	// cek role user
	if (req.user && req.user.role === requiredRole) {
		next();
	} else {
		res.status(403).json({message: 'Akses ditolak'});
	}
};
