const stockHandoverModel = require('../models/equip-hand-over-stock.model')

module.exports = {
  insertEquipmentStocks: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          equipmentName,
          equipmentNo,
          counterWeights,
          totalCounterWeight
        } = data;

        // Validate required fields
        if (!equipmentName || !equipmentNo) {
          return resolve({
            status: 400,
            success: false,
            message: 'Equipment name and number are required'
          });
        }

        console.log("HERE came");
        // Check for duplicate equipment number
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

        // Calculate total weight from counter weights
        let calculatedTotalWeight = 0;
        counterWeights.forEach(weight => {
          calculatedTotalWeight += parseFloat(weight.weight) || 0;
        });

        // Validate total counter weight
        if (totalCounterWeight && Math.abs(parseFloat(totalCounterWeight) - calculatedTotalWeight) > 0.01) {
          return resolve({
            status: 400,
            success: false,
            message: 'Total counter weight does not match the sum of individual weights'
          });
        }


        // Create new equipment record (without images initially)
        const newEquipment = new stockHandoverModel({
          equipmentName,
          equipmentNo,
          counterWeights,
          totalCounterWeight: calculatedTotalWeight,
          images: [], // Initialize with empty array, will add images later
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const savedEquipment = await newEquipment.save();

        resolve({
          status: 201,
          success: true,
          message: 'Equipment data stored successfully',
          id: savedEquipment._id, // Return the ID for subsequent image uploads
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
  },

  addEquipmentImage: (equipmentId, imagePath) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find equipment by ID
        const equipment = await stockHandoverModel.findById(equipmentId);
        
        if (!equipment) {
          return resolve({
            status: 404,
            success: false,
            message: 'Equipment not found'
          });
        }

        // Add image to the equipment's images array
        equipment.images.push(imagePath);
        equipment.updatedAt = new Date();
        
        // Save the updated equipment
        await equipment.save();
        
        resolve({
          status: 200,
          success: true,
          message: 'Image added successfully',
          data: {
            equipmentId,
            imagePath
          }
        });
      } catch (error) {
        console.error('Error adding equipment image:', error);
        reject({
          status: 500,
          success: false,
          message: 'Failed to add equipment image',
          error: error.message
        });
      }
    });
  }
};