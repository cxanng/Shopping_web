const Product = require("../models/product");
const { badRequest } = require("../utils/responseUtils");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response response object
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
 * @param {http.ServerResponse} response response object
 * @param {object} currentUser object represent current logged in user
 * @param {object} productData object represent data of to be added product
 */
const addProduct = async (response, currentUser, productData) => {
  if (currentUser.role === "customer") {
    return responseUtils.forbidden(response);
  }
  if (!productData.name) {
    return responseUtils.badRequest(response, "Name is missing!");
  }
  if (!productData.price) {
    return responseUtils.badRequest(response, "Price is missing!");
  }
  if (productData.price <= 0) {
    return responseUtils.badRequest(response, "Price must be positive!");
  }
  const newProduct = new Product({ ...productData });
  const savedUser = await newProduct.save();
  return responseUtils.createdResource(response, savedUser);
};

/**
 * Get a single product's information as JSON
 *
 * @param {http.ServerResponse} response response object
 * @param {string} productId id of product
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
 * @param {http.ServerResponse} response response object
 * @param {string} productId id of the product to be updated
 * @param {object} currentUser object represent current logged in user
 * @param {object} productData object represent data of update product
 */
const updateProduct = async (response, productId, currentUser, productData) => {
  if (currentUser.role !== "admin") {
    return responseUtils.forbidden(response);
  }
  const updatedProduct = await Product.findById(productId).exec();
  if (!updatedProduct) {
    return responseUtils.notFound(response);
  }
  const error = [];
  Object.keys(productData).forEach(element => {
    if (element === "name" && productData[element] === "") {
      error.push("Name cannot be empty");
    } else if (
      element === "price" &&
      typeof productData[element] !== "number"
    ) {
      error.push("Price must be a number");
    } else if (element === "price" && productData[element] <= 0) {
      error.push("Price must be positive");
    }
  });
  if (error.length !== 0) {
    return responseUtils.badRequest(response, error[0]);
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
 * @param {http.ServerResponse} response response object
 * @param {string} productId id of the product will be deleted
 * @param {object} currentUser object represent current logged in user
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
