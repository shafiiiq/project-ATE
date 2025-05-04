var express = require('express');
var router = express.Router();
const equipmentController = require('../controllers/equipment.controller')
const equipmentModel = require('../models/equip.model')

/* GET users listing. */
router.post('/add-equipments', equipmentController.addEquipments)
router.get('/get-equipments', equipmentController.getEquipments)
router.put('/update-equipments/:regNo',equipmentController.updateEquipments)
router.delete('/delete-equipments/:regNo',equipmentController.deleteEquipments)

module.exports = router;
