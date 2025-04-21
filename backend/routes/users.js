var express = require('express');
var router = express.Router();
const userController = require('../controllers/users.controllers')

/* GET users listing. */
router.post('/add-service-report', userController.addServiceReport)
router.get('/allusers', userController.getServiceReport)
router.put('/updateuser/:id',userController.updateServiceReport)
router.delete('/deleteuser/:id',userController.deleteServiceReport)
module.exports = router;
