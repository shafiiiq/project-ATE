const { promises } = require('fs');
const userModel = require('../models/service-report.model.js');
const serviceHistoryModel = require('../models/service-history.model.js');

module.exports = {

  insertServiceReport: (data) => {    
    return new Promise(async (resolve, reject) => {
      try {

        if (!data || !data.regNo || !data.date) {
          throw new Error('Missing required data: regNo, date, and reportDetails are required');
        }
    
        const result = await serviceHistoryModel.findOneAndUpdate(
          { 
            regNo: data.regNo,
            date: data.date 
          },
          { $push: { serviceReport: data } },
          { new: true } 
        );
  
        if (!result) {
          throw new Error(`No service history found for regNo: ${data.regNo} and date: ${data.date}`);
        }
  
        resolve({
          status: 200,
          ok: true,
          message: 'Service report updated',
          data: result
        });
  
      } catch (err) {
        reject({
          status: 500,
          ok: false,
          message: 'Missing data or an error occurred',
          error: err.message
        });
      }
    });
  },

  fetchServiceReport: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const getusers = await userModel.find({});
        resolve({
          status: 200,
          ok: true,
          data: getusers
        });
      } catch (error) {
        reject({
          status: 500,
          ok: false,
          message: error.message || 'Error fetching users'
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