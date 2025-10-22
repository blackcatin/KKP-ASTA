// TransactionController.js
// Generated automatically
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const transactionService = require('../services/TransactionService');

const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/', upload.single('nota'), async (req, res) => {
	const {user_id, transaction_type, amount, description} = req.body;

	if (!user_id || !transaction_type) {
		return res.status(400).json({message: 'User dan tipe transaksi tidak lengkap'});
	}

	if (transaction_type !== 'pemakaian' && (amount === undefined || amount === null)) {
		return res.status(400).json({message: 'Nominal transaksi wajib diisi'});
	}

	try {
		let nota_photo_url = null;
		if (req.file) {
			const dir = path.join('uploads', 'receipts');
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, {recursive: true});
			}

			const fileName = `nota_${Date.now()}.jpg`;
			const filePath = path.join('uploads', 'receipts', fileName);

			await sharp(req.file.buffer)
				.resize({width: 1024, height: 1024, fit: 'inside'})
				.jpeg({quality: 70})
				.toFile(filePath);
			nota_photo_url = `/uploads/receipts/${fileName}`;
		}

		let items = [];
		if (req.body.items) {
			try {
				items = JSON.parse(req.body.items);
			} catch (error) {
				console.error('Gagal parse items:', error);
				return res.status(400).json({message: 'Format item tidak valid'});
			}
		}

		const newTransaction = await transactionService.create({
			...req.body,
			nota_photo_url,
			items,
		});

		res.status(200).json({
			message: 'Transaksi berhasil dicatat',
			transaction: newTransaction,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.get('/', async (req, res) => {
	try {
		const transaction = await transactionService.getAll(req.query);
		res.status(200).json(transaction);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error Server'});
	}
});

module.exports = router;
