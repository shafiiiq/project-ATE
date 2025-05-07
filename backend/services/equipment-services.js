const { promises } = require('fs');
const equipmentModel = require('../models/equip.model');

module.exports = {

  insertEquipments: (data) => {

    return new Promise(async (resolve, reject) => {
      try {
        const existingUser = await equipmentModel.findOne({ regNo: data.regNo });

        if (existingUser) {
          return reject({
            status: 500,
            ok: false,
            message: 'Equipment already exists',
          });
        }

        const users = await equipmentModel.create(data);

        resolve({
          status: 200,
          ok: true,
          message: 'Equipments added successfully',
          data: users
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

  fetchEquipments: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const getusers = await equipmentModel.find({outside: false});
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

  updateEquipments: (regNo, updatedData) => {
    return new Promise(async (resolve, reject) => {

      console.log(updatedData);
      
      try {

        const equipment = await equipmentModel.findOne({ regNo: regNo });
        if (!equipment) {
          return reject({ status: 404, ok: false, message: 'Equipment not found' });
        }

        if (updatedData.operator) {
          if (!equipment.certificationBody) equipment.certificationBody = [];

          equipment.certificationBody.push(updatedData.operator);
          delete updatedData.operator;
        }

        Object.assign(equipment, updatedData);

        await equipment.save();

        resolve({
          status: 200,
          ok: true,
          message: 'Equipment updated successfully',
          data: equipment
        });
      } catch (error) {
        reject({ status: 500, ok: false, message: 'Unable to update equipment' });
      }
    });
  },

  deleteEquipments: (regNo) => {
    return new Promise(async (resolve, reject) => {
      try {
        const validUser = await equipmentModel.findOne({ regNo: regNo });
        if (validUser) {
          const deleteUser = await equipmentModel.findOneAndDelete({ regNo: regNo });
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