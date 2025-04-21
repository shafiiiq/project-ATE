const userServices = require('../services/service-report.js')

const addServiceReport = async (req, res) => {
  userServices.insertServiceReport(req.body)
    .then((addedUser) => {
      if (addedUser) {
        res.status(addedUser.status).json(addedUser)
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({ error: err.message })
    })
}

const getServiceReport = async (req, res) => {
  userServices.fetchServiceReport()
    .then((fetchedUsers) => {
      if (fetchedUsers) {
        res.status(fetchedUsers.status).json(fetchedUsers)
      }
    })
    .catch((err) => {
      res.status(err.status || 500).json({ message: 'Cannot get all users', error: err.message })
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
  addServiceReport,
  getServiceReport,
  updateServiceReport,
  deleteServiceReport
};
