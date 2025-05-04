const stockHandoverModel = require('../models/equip-hand-over-stock.model')

module.exports = {
  insertEquipmentStocks: (data) => {  
    console.log("here here here here");
      
    return new Promise(async (resolve, reject) => {
      try {
        // Destructure data from request body
        const { 
          equipmentName, 
          equipmentNo, 
          counterWeights, 
          totalCounterWeight, 
          images 
        } = data;
        
        // Validate required fields
        if (!equipmentName || !equipmentNo) {
          return resolve({
            status: 400,
            success: false,
            message: 'Equipment name and number are required'
          });
        }
        
        // Check if equipment with the same number already exists
        const existingEquipment = await stockHandoverModel.findOne({ equipmentNo });
        if (existingEquipment) {
          return resolve({
            status: 400,
            success: false,
            message: 'Equipment with this number already exists'
          });
        }

        // Validate counter weights
        if (!counterWeights || !Array.isArray(counterWeights) || counterWeights.length === 0) {
          return resolve({
            status: 400,
            success: false,
            message: 'At least one counter weight is required'
          });
        }
        
        // Validate images
        if (!images || !Array.isArray(images) || images.length === 0) {
          return resolve({
            status: 400,
            success: false,
            message: 'At least one equipment image is required'
          });
        }
        
        // Calculate total counter weight if not provided or validate it
        let calculatedTotalWeight = 0;
        counterWeights.forEach(weight => {
          calculatedTotalWeight += parseFloat(weight.weight) || 0;
        });
        
        // If total weight is provided, verify it matches the calculated value
        if (totalCounterWeight && Math.abs(parseFloat(totalCounterWeight) - calculatedTotalWeight) > 0.01) {
          return resolve({
            status: 400,
            success: false,
            message: 'Total counter weight does not match the sum of individual weights'
          });
        }
        
        // Create new equipment record
        const newEquipment = new stockHandoverModel({
          equipmentName,
          equipmentNo,
          counterWeights,
          totalCounterWeight: calculatedTotalWeight,
          images,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Save to database
        const savedEquipment = await newEquipment.save();
        
        // Return success response
        resolve({
          status: 201,
          success: true,
          message: 'Equipment data stored successfully',
          data: savedEquipment
        });
        
      } catch (error) {
        console.error('Error storing equipment data:', error);
        
        reject({
          status: 500,
          success: false,
          message: 'Failed to store equipment data',
          error: error.message
        });
      }
    });
  }
}