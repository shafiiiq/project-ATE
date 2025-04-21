const { promises } = require('fs');
const serviceHistoryModel = require('../models/service-history.model.js');

module.exports = {

    insertServiceHisory: (data) => {

        console.log("here the data: ", data);
        
        return new Promise(async (resolve, reject) => {
            try {

                const serviceHistory = await serviceHistoryModel.create({
                    regNo: data.regNo,
                    date: data.date,
                    oil: data.oil,
                    oilFilter: data.oilFilter,
                    fuelFilter: data.fuelFilter,
                    waterSeparator: data.waterSeparator,
                    airFilter: data.airFilter,
                    serviceHrs: data.serviceHrs,
                    nextServiceHrs: data.nextServiceHrs
                });

                serviceHistory.save()

                resolve({
                    status: 200,
                    ok: true,
                    message: 'Service History added successfully',
                    data: serviceHistory
                });

            } catch (err) {
                console.error("Error occurred:", err); // Log the full error
                reject({
                    status: 500,
                    ok: false,
                    message: 'Missing data or an error occurred',
                    error: err.message
                });
            }
        });
    },

    fetchServiceHistory: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const getusers = await serviceHistoryModel.find({ regNo: data });
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

    updateServiceHistory: (id, updateData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const validUser = await serviceHistoryModel.findById(id);
                if (validUser) {
                    const updatedUser = await serviceHistoryModel.findByIdAndUpdate(id, updateData);
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
    deleteServiceHistory: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const validUser = await serviceHistoryModel.findById(id);
                if (validUser) {
                    const deleteUser = await serviceHistoryModel.findByIdAndDelete(id);
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