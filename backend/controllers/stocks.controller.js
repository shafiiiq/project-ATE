const stockServices = require('../services/stocks-services.js')

const addEquipmentStocks = async (req, res) => {
    stockServices.insertEquipmentStocks(req.body)
    .then((addHistory) => {
      if (addHistory) {
        res.status(addHistory.status).json(addHistory)
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({ error: err.message })
    })
}

module.exports = {
    addEquipmentStocks
};
