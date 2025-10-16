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
	const {name, description} = req.body;
	if (!name || !description)
		return res.status(400).json({message: 'Nama & deskripsi kategori wajib diisi'});

	try {
		const newCat = await categoryservice.createCat(req.body);
		res.status(201).json({message: 'Kategori berhasil ditambahkan', category: newCat});
	} catch (error) {
		if (error.code === '23505') return res.status(409).json({message: 'kategori sudah ada'});
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.put('/:id', auth.authMiddleware, auth.authorizeRole('owner'), async (req, res) => {
	const {id} = req.params;
	const {name, description} = req.body;

	if (!name) {
		return res.status(400).json({message: 'Nama kategori wajib diisi'});
	}

	try {
		const categoryId = parseInt(id);

		const updatePayload = {
			name: name,
			description: description === undefined ? null : description, // nullable
		};

		const updateCategory = await categoryservice.updateCat(categoryId, updatePayload);

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

		const deletedCat = await categoryservice.deleteCat(categoryId);

		if (deletedCat === 0) {
			return res.status(404).json({message: 'Kategori tidak ditemukan'});
		}

		return res.status(200).json({message: 'Item berhasil dihapus'});
	} catch (error) {
		if (error.code === '23503') {
			return res.status(409).json({
				message: 'Tidak dapat menghapus. Kategori ini masih digunakan',
			});
		}

		console.error(error);
		res.status(500).json({message: 'Server error '});
	}
});

module.exports = router;
