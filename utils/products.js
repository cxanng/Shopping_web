/**
 * Product ultilities
 */

const products = require("../products.json").map(product => ({ ...product }));

/**
 * Return all products
 *
 * @returns {Array<object>} all products
 */
const getAllProducts = () => products.map(product => ({ ...product }));

/**
 * Return product object with matching ID or undefined if not found.
 *
 * @param {string} productId id of the product
 * @returns {object/undefined} product with given id or undefined
 */
const getProductById = productId => {
  const product = products.find(element => element._id === productId);
  if (!product) {
    return undefined;
  }
  return { ...product };
};

module.exports = {
  getAllProducts,
  getProductById
};
