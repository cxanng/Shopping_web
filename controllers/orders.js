const Order = require("../models/order");
const responseUtils = require("../utils/responseUtils");

/**
 * Get all appropriate order.
 * Return a collection of all orders in the system.
 * For customer return a collection of this user's own orders
 *
 * @param {http.ServerResponse} response response object
 * @param {object} currentUser object represent current logged in user
 * @returns request sent
 */
const getAllOrders = async (response, currentUser) => {
  if (currentUser.role === "customer") {
    return responseUtils.sendJson(
      response,
      await Order.find({ customerId: currentUser.id })
    );
  }
  return responseUtils.sendJson(response, await Order.find());
};

/**
 * Get information about a single order in the system
 * For a customer return the order if it is their own order
 *
 * @param {http.ServerResponse} response response object
 * @param {string} orderId Id of the order
 * @param {object} currentUser object represent current logged in user
 */
const viewOrder = async (response, orderId, currentUser) => {
  const viewedOrder = await Order.findById(orderId).exec();
  if (!viewedOrder) {
    return responseUtils.notFound(response);
  }
  if (currentUser.role === "customer") {
    if (viewedOrder.customerId.toString() === currentUser.id) {
      return responseUtils.sendJson(response, viewedOrder);
    }
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, viewedOrder);
};

/**
 * Add a new order.
 *
 * @param {http.ServerResponse} response response object
 * @param {object} orderData data of the to-be-added order
 * @param {object} currentUser object represent current logged in user
 */
const addOrder = async (response, currentUser, orderData) => {
  if (currentUser.role === "admin") {
    return responseUtils.forbidden(response);
  }
  const error = [];
  if (orderData.items.length === 0) {
    return responseUtils.badRequest(response, "order must contain items");
  }
  orderData.items.forEach(item => {
    if (!item.quantity) {
      error.push("Quantity is missing!");
    }
    if (!item.product) {
      error.push("Product is missing!");
    } else {
      ["_id", "name", "price"].forEach(element => {
        if (!item.product[element]) {
          error.push(`${element} is missing!`);
        }
      });
    }
  });
  if (error.length !== 0) {
    return responseUtils.badRequest(response, error[0]);
  }
  const newOrder = new Order({
    customerId: currentUser.id,
    ...orderData
  });
  const savedOrder = await newOrder.save();
  return responseUtils.createdResource(response, savedOrder);
};

module.exports = {
  getAllOrders,
  viewOrder,
  addOrder
};
