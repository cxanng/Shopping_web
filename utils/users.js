/**
 * Week 08 utility file for user related operations
 *
 * NOTE: This file will be abandoned during week 09 when a database will be used
 * to store all data.
 */

/**
 * Use this object to store users
 *
 * An object is used so that users can be reset to known values in tests
 * a plain const could not be redefined after initialization but object
 * properties do not have that restriction.
 */
const data = {
  // make copies of users (prevents changing from outside this module/file)
  users: require("../users.json").map(user => ({ ...user })),
  roles: ["customer", "admin"]
};

/**
 * Reset users back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetUsers = () => {
  // make copies of users (prevents changing from outside this module/file)
  data.users = require("../users.json").map(user => ({ ...user }));
};

/**
 * Generate a random string for use as user ID
 * @returns {string} generated id
 */
const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  // Generate unique random id that is not already in use
  // Shamelessly borrowed from a Gist. See:
  // https://gist.github.com/gordonbrander/2230317
  if (data.users.some(u => u._id === id)) {
    return generateId();
  }
  return id;
};

/**
 * Check if email is already in use by another user
 *
 * @param {string} email email to be checked
 * @returns {boolean} true if the provided email is already used
 */
const emailInUse = email => {
  // TODO: 8.3 Check if there already exists a user with a given email
  // throw new Error('Not Implemented');
  return data.users.some(element => element.email === email);
};

/**
 * Return user object with the matching email and password or undefined if not found
 *
 * Returns a copy of the found user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} email email of user
 * @param {string} password password of user
 * @returns {object|undefined} User with provided email and password or undefined if user does not exist
 */
const getUser = (email, password) => {
  // TODO: 8.3 Get user whose email and password match the provided values

  const user = data.users.find(
    element => element.email === email && element.password === password
  );
  if (!user) {
    return user;
  }
  return { ...user };
};

/**
 * Return user object with the matching ID or undefined if not found.
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId id of user
 * @returns {object|undefined} User with provided id or undefined if user does not exist
 */
const getUserById = userId => {
  // TODO: 8.3 Find user by user id

  const user = data.users.find(element => element._id === userId);
  if (!user) {
    return undefined;
  }
  return { ...user };
};

/**
 * Delete user by its ID and return the deleted user
 *
 * @param {string} userId id of user
 * @returns {object|undefined} deleted user or undefined if user does not exist
 */
const deleteUserById = userId => {
  // TODO: 8.3 Delete user with a given id
  // throw new Error('Not Implemented');
  const index = data.users.findIndex(element => element._id === userId);
  if (index === -1) {
    return undefined;
  }
  return data.users.splice(index, 1)[0];
};

/**
 * Return all users
 *
 * Returns copies of the users and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<object>} all users
 */
const getAllUsers = () => data.users.map(user => ({ ...user }));

/**
 * Save new user
 *
 * Saves user only in memory until node process exits (no data persistence)
 * Save a copy and return a (different) copy of the created user
 * to prevent modifying the user outside this module.
 *
 * DO NOT MODIFY OR OVERWRITE users.json
 *
 * @param {object} user to be saved user object
 * @returns {object} copy of the created user
 */
const saveNewUser = user => {
  // TODO: 8.3 Save new user
  // Use generateId() to assign a unique id to the newly created user.
  // throw new Error('Not Implemented');
  const copy = {
    ...user,
    _id: generateId(),
    role: data.roles.includes(user.role) ? user.role : "customer"
  };
  data.users = data.users.concat(copy);
  return copy;
};

/**
 * Update user's role
 *
 * Updates user's role or throws an error if role is unknown (not "customer" or "admin")
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId id of user to be updated role
 * @param {string} role "customer" or "admin"
 * @returns {object|undefined} copy of the updated user or undefined if user does not exist
 * @throws {Error} error object with message "Unknown role"
 */
const updateUserRole = (userId, role) => {
  // TODO: 8.3 Update user's role
  // throw new Error('Not Implemented');
  if (!data.roles.includes(role)) {
    throw new Error("Unknown role");
  }
  let updatedUser = data.users.find(element => element._id === userId);
  if (!updatedUser) {
    return undefined;
  }
  updatedUser = { ...updatedUser, role };
  data.users = data.users.map(user =>
    user._id !== userId ? user : updatedUser
  );
  return updatedUser;
};

/**
 * Validate user object (Very simple and minimal validation)
 *
 * This function can be used to validate that user has all required
 * fields before saving it.
 *
 * @param {object} user user object to be validated
 * @returns {Array<string>} Array of error messages or empty array if user is valid
 */
const validateUser = user => {
  // TODO: 8.3 Validate user before saving
  // throw new Error('Not Implemented');
  const arr = ["email", "password", "name"].reduce((acc, field) => {
    if (!Object.keys(user).includes(field)) {
      return acc.concat(`Missing ${field}`);
    }
    return acc;
  }, []);
  if (Object.keys(user).includes("role") && !data.roles.includes(user.role)) {
    arr.push("Unknown role");
  }
  return arr;
};

module.exports = {
  deleteUserById,
  emailInUse,
  getAllUsers,
  getUser,
  getUserById,
  resetUsers,
  saveNewUser,
  updateUserRole,
  validateUser
};
