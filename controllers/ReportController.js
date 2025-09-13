// ReportController.js
// Generated automatically
const express = require('express');
const router = express.Router();
const ReportService = require('../services/ReportService');

router.get('/laba-rugi', async (req, res) => {
	try {
		const report = await ReportService.getProfitAndLoss(req.query);
		res.status(200).json(report);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.get('/arus-kas', async (req, res) => {
	try {
		const report = await ReportService.getCashFlow(req.query);
		res.status(200).json(report);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

module.exports = router;
