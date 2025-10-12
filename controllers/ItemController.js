// ItemController.js
// Generated automatically
const express = require('express');
const router = express.Router();
const ItemService = require('../services/ItemService');
const {route} = require('./TransactionController');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	try {
		const items = await ItemService.getAll();
		res.status(200).json(items);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.post('/', async (req, res) => {
	const {item_name, category_id, current_stock} = req.body;

	if (!item_name || !category_id) {
		return res.status(400).json({message: 'Nama & Kategori harus diisi'});
	}

	try {
		const newItem = await ItemService.create(req.body);
		res.status(201).json({message: 'Item berhasil ditambahkan', item: newItem});
	} catch (error) {
		if (error.code === '23505') return res.status(409).json({message: 'Item sudah ada'});

		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.put('/:id', auth.authMiddleware, auth.authorizeRole('owner'), async (req, res) => {
	const {item_name, category_id} = req.body;
	const {id} = req.params;
	const updateData = req.body;

	if (!item_name || !category_id) {
		return res.status(400).json({message: 'Nama & Kategori wajib diisi'});
	}

	try {
		const updateItem = await ItemService.updateItem(id, updateData);
		const itemId = parseInt(id);

		if (!updateItem) {
			return res.status(404).json({message: 'Item tidak ditemukan'});
		}

		if (isNaN(itemId)) {
			return res.status(400).json({message: 'ID tidak valid'});
		}

		res.status(200).json({message: 'Item berhasil diedit', item: updateItem});
	} catch (error) {
		// duplikasi nama
		if (error.code === '23505') {
			return res.status(409).json({message: 'Nama item sudah digunakan.'});
		}
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', auth.authMiddleware, auth.authorizeRole('owner'), async (req, res) => {
	const {id} = req.params;

	try {
		const itemId = parseInt(id);

		if (isNaN(itemId)) {
			return res.status(400).json({message: 'ID item tidak valid'});
		}

		const deletedCount = await ItemService.deleteItem(itemId);

		if (deletedCount === 0) {
			return res.status(404).json({message: 'Item tidak ditemukan'});
		}
		return res.status(200).json({message: 'Item berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
