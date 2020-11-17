const User = require("../models/user");
const responseUtils = require("../utils/responseUtils");

/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response
 */
const getAllUsers = async response => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');

  const allUser = await User.find();
  return responseUtils.sendJson(response, allUser);
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  if (currentUser.id === userId) {
    return responseUtils.badRequest(response, "Cannot delete yourself!");
  }
  if (currentUser.role === "customer") {
    return responseUtils.forbidden(response);
  }
  const modifyUser = await User.findById(userId).exec();
  if (!modifyUser) {
    return responseUtils.notFound(response);
  }
  await User.deleteOne({ _id: userId });
  return responseUtils.sendJson(response, modifyUser);
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 * @param {Object} userData JSON data from request body
 */
const updateUser = async (response, userId, currentUser, userData) => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  if (userId === currentUser.id) {
    return responseUtils.badRequest(
      response,
      "Updating own data is not allowed"
    );
  }
  if (currentUser.role === "customer") {
    return responseUtils.forbidden(response);
  }
  const updatedUser = await User.findById(userId).exec();
  if (!updatedUser) {
    return responseUtils.notFound(response);
  }
  if (!userData.role) {
    return responseUtils.badRequest(response, "Missing role!");
  }
  if (userData.role !== "admin" && userData.role !== "customer") {
    return responseUtils.badRequest(response, "Unknown role!");
  }
  updatedUser.role = userData.role;
  const modifiedUser = await updatedUser.save();
  return responseUtils.sendJson(response, modifiedUser);
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {string} userId
 * @param {Object} currentUser (mongoose document object)
 */
const viewUser = async (response, userId, currentUser) => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  if (currentUser.role === "customer") {
    return responseUtils.forbidden(response);
  }
  const viewedUser = await User.findById(userId).exec();
  if (!viewedUser) {
    return responseUtils.notFound(response);
  }
  return responseUtils.sendJson(response, viewedUser);
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  // TODO: 10.1 Implement this
  // throw new Error('Not Implemented');
  const error = [];
  ["email", "password", "name"].forEach(element => {
    if (!userData[element]) {
      error.push(`${element} is missing!`);
    }
  });
  if (error.length !== 0) {
    return responseUtils.badRequest(response, error[0]);
  }
  if (!userData["email"].includes("@")) {
    return responseUtils.badRequest(response, "Email is invalid");
  }
  if (userData["password"].length < 10) {
    return responseUtils.badRequest(response, "Password is too short");
  }
  const userInuse = await User.findOne({ email: userData.email });
  if (userInuse) {
    return responseUtils.badRequest(response, "Email in use");
  } else {
    const newUser = new User({ ...userData, role: "customer" });
    const savedUser = await newUser.save();
    return responseUtils.createdResource(response, savedUser);
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  deleteUser,
  viewUser,
  updateUser
};
