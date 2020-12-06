const { getCredentials } = require("../utils/requestUtils");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
  const token = getCredentials(request);
  if (!token) {
    return null;
  }
  const decodedToken = jwt.verify(token, `${process.env.SECRET}`);
  if (!token || !decodedToken.email) {
    return null;
  }
  const user = await User.findOne({ email: decodedToken.email }).exec();
  return user;
};

const verifyLoginUser = async body => {
  const user = await User.findOne({ email: body.email }).exec();
  const passwordCorrect =
    user === null ? false : await user.checkPassword(body.password);
  if (!passwordCorrect) {
    return null;
  }

  const userForToken = {
    email: user.email,
    id: user._id
  };

  const token = jwt.sign(userForToken, `${process.env.SECRET}`);
  return { token, email: user.email, name: user.name };
};

module.exports = { getCurrentUser, verifyLoginUser };
