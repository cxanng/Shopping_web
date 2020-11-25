const Product = require("../models/product");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  const products = await Product.find();
  return responseUtils.sendJson(response, products);
};

/**
 * Add a new product
 *
 * @param {http.ServerResponse} response
 * @param {Object} currentUser
 * @param {Object} productData
 */
const addProduct = async (response, currentUser, productData) => {
  const error = [];
  ["price", "name"].forEach(element => {
    if (!productData[element]) {
      error.push(`${element} is missing!`);
    }
  });
  if (error.length !== 0) {
    return responseUtils.badRequest(response, error[0]);
  }
  if (currentUser.role !== "admin") {
    return responseUtils.forbidden(response);
  }
  const newProduct = new Product({ ...productData });
  const savedUser = await newProduct.save();
  return responseUtils.createdResource(response, savedUser);
};

/**
 * Get a single product's information as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} productId
 */
const viewProduct = async (response, productId) => {
  const viewedProduct = await Product.findById(productId).exec();
  if (!viewedProduct) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, viewedProduct);
};

/**
 * Update product and sane updated product as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} productId
 * @param {Object} currentUser
 * @param {Object} productData
 */
const updateProduct = async (response, productId, currentUser, productData) => {
  if (currentUser.role !== "admin") {
    return responseUtils.forbidden(response);
  }
  const updatedProduct = await Product.findById(productId).exec();
  if (!updatedProduct) {
    return responseUtils.notFound(response);
  }
  Object.keys(productData).forEach(element => {
    updatedProduct[element] = productData[element];
  });
  const modifiedProduct = await updatedProduct.save();
  return responseUtils.sendJson(response, modifiedProduct);
};

/**
 * Delete a product and send deleted product as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} productId
 * @param {Object} currentUser
 */
const deleteProduct = async (response, productId, currentUser) => {
  if (currentUser.role !== "admin") {
    return responseUtils.forbidden(response);
  }
  const deletedProduct = await Product.findById(productId).exec();
  if (!deletedProduct) {
    return responseUtils.notFound(response);
  }
  await Product.deleteOne({ _id: productId });
  return responseUtils.sendJson(response, deletedProduct);
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  viewProduct,
  deleteProduct
};
