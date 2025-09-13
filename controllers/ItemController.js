// ItemController.js
// Generated automatically
const express = require('express');
const router = express.Router();
const ItemService = require('../services/ItemService');
const {route} = require('./TransactionController');

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
	const {item_name, category, current_stock} = req.body;

	if (!item_name || !category) {
		return res.status(400).json({message: 'Nama & Kategori harus'});
	}

	try {
		const newItem = await ItemService.create(req.body);
		res.status(201).json({message: 'Item berhasil ditambahkan', item: newItem});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

module.exports = router;
