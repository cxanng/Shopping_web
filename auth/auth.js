const { getCredentials } = require("../utils/requestUtils");
const User = require("../models/user");

/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request request object from client
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // TODO: 8.4 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  // throw new Error('Not Implemented');
  const authorization = request.headers["authorization"];
  if (!authorization) {
    return null;
  }
  if (!authorization.startsWith("Basic")) {
    return null;
  }
  const data = getCredentials(request);
  const user = await User.findOne({ email: data[0] }).exec();
  const passwordCorrect =
    user === null ? false : await user.checkPassword(data[1]);
  if (!passwordCorrect) {
    return null;
  }
  return user;
};

module.exports = { getCurrentUser };
