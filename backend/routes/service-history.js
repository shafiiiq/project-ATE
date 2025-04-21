var express = require('express');
var router = express.Router();
const serviceHistoryController = require('../controllers/service-history.controller')


/* GET users listing. */
router.post('/add-service-history', serviceHistoryController.addServiceHistory)
router.get('/get-service-history/:regNo', serviceHistoryController.getServiceHistory)
// router.put('/updateuser/:id', userController.updateServiceReport)
// router.delete('/deleteuser/:id', userController.deleteServiceReport)
 
module.exports = router; 
 