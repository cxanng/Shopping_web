const responseUtils = require("../utils/responseUtils");

/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllProducts = async response => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  const products = require("../products.json").map(product => ({ ...product }));
  return responseUtils.sendJson(response, products);
};

module.exports = { getAllProducts };
