// const { promises } = require('fs');
// const productModel = require('../models/products.model');
// const usersModel = require('../models/users.model');
// const { status } = require('init');
// module.exports = {
//   insertProduct: (data) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const products = await productModel.create(data)
//         resolve({
//           status: 200,
//           ok: true,
//           message: "product added sucessfully",
//           data: products
//         })
//       } catch (err) {
//         reject({
//           status: 500,
//           ok: false,
//           message: "unable to add product",
//           error: err.message
//         })
//       }
//     })

//   },

//   fetchProducts: () => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const getProducts = await productModel.find({});
//         resolve({
//           status: 200,
//           ok: true,
//           data: getProducts
//         });
//       } catch (error) {
//         reject({
//           status: 500,
//           ok: false,
//           message: error.message
//         });
//       }
//     });
//   },

//   insertToCart: (data) => {
//     return new Promise(async (resolve, reject) => {
//       const validuser = await usersModel.findById({ _id: data.userId })
//       if (validuser) {
//         resolve({
//           status: 200,
//           ok: true,
//           message: 'product added to cart',
//           data: await usersModel.updateOne({ _id: data.userId },
//             {
//               $push: { cart: data.productId }
//             }
//           )
//         })
//       }
//       reject({
//         status: 400,
//         ok: false,
//         message: 'user not found'
//       })

//     })

//   },

//   fetchCart: (userId) => {
//     return new Promise(async (resolve, reject) => {
//       try {

//         const user = await usersModel.findById({ _id: userId });

//         if (!user) {
//           return reject({
//             status: 400,
//             ok: false,
//             message: 'User not found'
//           });
//         }


//         const cartItems = await usersModel.aggregate([
//           {
//             $match: { _id: user._id }
//           },
//           {
//             $lookup: {
//               from: 'productmodels',
//               let: { cart: user.cart },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $in: ["$_id", {
//                         $map: {
//                           input: "$$cart",
//                           as: "cartId",
//                           in: { $toObjectId: "$$cartId" }
//                         }
//                       }]
//                     }
//                   }
//                 }
//               ],
//               as: 'productDetails'
//             }
//           }
//         ]);

//         resolve({
//           status: 200,
//           ok: true,
//           message: "Cart fetched successfully",
//           data: cartItems[0].productDetails
//         });
//       } catch (error) {
//         reject({
//           status: 500,
//           ok: false,
//           message: 'Error fetching cart',
//           error: error.message
//         });
//       }
//     });
//   }



// }