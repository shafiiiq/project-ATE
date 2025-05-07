const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocks.controller');
const { processEquipmentData, uploadEquipmentImages } = require('../multer/hand_over');

// Route to handle basic equipment data (without images)
router.post('/add-handover-report', processEquipmentData, stocksController.addEquipmentStocks);

// Route to handle image uploads for equipment
router.post('/add-equipment-image', uploadEquipmentImages, stocksController.addEquipmentImage);

module.exports = router;