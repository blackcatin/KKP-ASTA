// CategoryController.js
// Generated automatically
const express = require('express');
const router = express.Router();
const categoryservice = require('../services/CategoryService');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	try {
		const categories = await categoryservice.getAll();
		res.status(200).json(categories);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.post('/', async (req, res) => {
	const {name} = req.body;
	if (!name) return res.status(400).json({message: 'Nama kategori wajib diisi'});

	try {
		const newCat = await categoryservice.create(name);
		res.status(201).json({message: 'Kategori berhasil ditambahkan', category: newCat});
	} catch (error) {
		if (error.code === '23505') return res.status(409).json({message: 'Nama kategori sudah ada'});
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.put('/:id', auth.authMiddleware, auth.authorizeRole('owner'), async (req, res) => {
	const {name} = req.body;
	const {id} = req.params;

	if (!name) return res.status(400).json({message: 'Nama wajib diisi'});

	try {
		const updateCategory = await categoryservice.update(parseInt(id), name);
		if (!updateCategory) {
			return res.status(404).json({message: 'Kategori tidak ditemukan'});
		}

		res.status(200).json({message: 'Kategori berhasil diperbarui', category: updateCategory});
	} catch (error) {
		if (error.code === '23505') {
			return res.status(409).json({message: 'Nama kategori sudah ada'});
		}

		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', auth.authMiddleware, auth.authorizeRole('owner'), async (req, res) => {
	const {id} = req.params;

	try {
		const categoryId = parseInt(id);
		if (isNaN(categoryId)) {
			return res.status(400).json({message: 'ID tidak valid'});
		}

		const deletedCat = await categoryservice.delete(categoryId);

		if (deletedCat === 0) {
			return res.status(404).json({message: 'Kategori tidak ditemukan'});
		}

		return res.status(200).json({message: 'Item berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error '});
	}
});

module.exports = router;
