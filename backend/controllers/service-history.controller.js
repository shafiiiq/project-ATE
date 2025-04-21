const userServices = require('../services/service-report.js')
const serviceHistoryServices = require('../services/service-history-services.js')

const addServiceHistory = async (req, res) => {
  serviceHistoryServices.insertServiceHisory(req.body) 
    .then((addHistory) => {
      if (addHistory) {
        res.status(addHistory.status).json(addHistory)
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({ error: err.message })
    })
}

const getServiceHistory = async (req, res) => {
  const regNo = req.params.regNo;
  console.log("yes here", regNo);
  
  serviceHistoryServices.fetchServiceHistory(regNo)
    .then((fetchedHistory) => {
      if (fetchedHistory) {
        res.status(fetchedHistory.status).json(fetchedHistory)
      } else {
        res.status(404).json({ message: 'No service history found' })
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({ message: 'Cannot get service history', error: err.message })
    })
}

const updateServiceReport = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  userServices.updateServiceReport(id, updateData)
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(updatedUser.status).json(updatedUser)
      }
    })
    .catch((err) => {
      res.status(err.status).json({ error: err.message })
    })
}


const deleteServiceReport = async (req, res) => {
  const { id } = req.params;

  userServices.deleteServiceReport(id)
    .then((response) => {
      if (response) {
        res.status(response.status).json(response)
      }
    })
    .catch((err) => {
      res.status(err.status).json({ error: err.message })
    })
}

module.exports = {
  addServiceHistory,
  getServiceHistory,
  updateServiceReport,
  deleteServiceReport
};
