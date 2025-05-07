const stockServices = require('../services/stocks-services.js')

const addEquipmentStocks = async (req, res) => { 
  try {
    const result = await stockServices.insertEquipmentStocks(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ 
      success: false,
      message: err.message 
    });
  }
};

const addEquipmentImage = async (req, res) => {
  console.log("Here is the thing ", req.body);
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const equipmentId = req.body.equipmentId;
    if (!equipmentId) {
      return res.status(400).json({
        success: false,
        message: 'Equipment ID is required'
      });
    }

    // Save image path to equipment record
    const imagePath = req.file.path;
    const result = await stockServices.addEquipmentImage(equipmentId, imagePath);
    
    res.status(result.status).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ 
      success: false,
      message: err.message 
    });
  }
};

module.exports = {
    addEquipmentStocks,
    addEquipmentImage
};
