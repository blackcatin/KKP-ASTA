// TransactionController.js
// Generated automatically
const express = require('express');
const router = express.Router();
const transactionService = require('../services/TransactionService');

router.post('/', async (req, res) => {
	const {user_id, transaction_type, amount} = req.body;

	if (!user_id || !transaction_type || !amount) {
		return res.status(400).jsno({message: 'Data transaksi tidak lengkap'});
	}

	try {
		const newTransaction = await transactionService.create(req.body);

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
