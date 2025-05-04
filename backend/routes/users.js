var express = require('express');
var router = express.Router();
const userController = require('../controllers/users.controllers')
const serviceHistoryModel = require('../models/service-history.model.js');

/* GET users listing. */
router.post('/add-service-report', userController.addServiceReport)
router.get('/get-service-report/:regNo/:date', userController.getServiceReport)
router.put('/updateuser/:id',userController.updateServiceReport)
router.delete('/deleteuser/:id',userController.deleteServiceReport)

router.post('/add-that' , async() => {
    try {
        const result = await serviceHistoryModel.updateMany(
          {}, // Empty filter means all documents
          { $set: { fullService: false } } // Set fullService: false for all documents
        );
        
        console.log(`Updated ${result.modifiedCount} documents successfully`);
        return result;
      } catch (error) {
        console.error('Error updating documents:', error);
        throw error;
      }
})

module.exports = router;
