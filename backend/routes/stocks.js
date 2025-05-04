const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocks.controller');
const { uploadEquipmentImages } = require('../multer/hand_over');

router.post('/add-handover-report', uploadEquipmentImages, stocksController.addEquipmentStocks);

module.exports = router;