const { promises } = require('fs');
const userModel = require('../models/service-report.model.js');
const serviceHistoryModel = require('../models/service-history.model.js');
const serviceReportModel = require('../models/service-report.model.js');

module.exports = {

  insertServiceReport: (data) => {
    console.log('Attempting to insert service report:', data);
    
    return new Promise(async (resolve, reject) => {
      try {
        // Validate required fields
        if (!data || !data.regNo || !data.date) {
          throw new Error('Missing required data: regNo and date are required');
        }
        
        // Try to create the record
        const result = await serviceReportModel.create(data);
        
        // This condition seems strange - create() normally returns the created object
        // It shouldn't be null if creation was successful
        if (!result) {
          throw new Error(`Failed to create service report for regNo: ${data.regNo}`);
        }
        
        resolve({
          status: 200,
          ok: true,
          message: 'Service report created successfully',
          data: result
        });
        
      } catch (err) {
        console.error('Error inserting service report:', err);
        
        // Return the actual error message for better debugging
        reject({
          status: 500,
          ok: false,
          message: `Error creating service report: ${err.message}`,
          error: err.message
        });
      }
    });
  },

  fetchServiceReport: (paramRegNO, paramDate) => {
    console.log("param reg no ", paramRegNO);
    console.log("param date ", paramDate);
    
    // Convert the date format from DD-MM-YYYY to YYYY-MM-DD
    const dateParts = paramDate.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    
    return new Promise(async (resolve, reject) => {
      try {
        const getReport = await serviceReportModel.find({
          regNo: paramRegNO, 
          date: formattedDate
        });
        
        resolve({
          status: 200,
          ok: true,
          data: getReport
        });
      } catch (error) {
        reject({
          status: 500,
          ok: false,
          message: error.message || 'Error fetching Reports'
        });
      }
    });
  },

  updateServiceReport: (id, updateData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const validUser = await userModel.findById(id);
        if (validUser) {
          const updatedUser = await userModel.findByIdAndUpdate(id, updateData);
          return resolve({
            status: 200,
            ok: true,
            message: 'User updated successfully',
            data: updatedUser
          });
        }
      } catch (error) {
        reject({
          status: 500,
          ok: false,
          message: 'unable to update user'
        });
      }
    });
  },
  deleteServiceReport: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const validUser = await userModel.findById(id);
        if (validUser) {
          const deleteUser = await userModel.findByIdAndDelete(id);
          return resolve({
            status: 200,
            ok: true,
            message: 'User deleted successfully',
            data: deleteUser
          });
        }
      } catch (error) {
        reject({
          status: 500,
          ok: false,
          message: 'unable to delete user'
        });
      }
    });
  }

}