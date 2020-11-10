const responseUtils = require("./utils/responseUtils");
const { acceptsJson, isJson, parseBodyJson, getCredentials } = require("./utils/requestUtils");
const { renderPublic } = require("./utils/render");
const { emailInUse, getAllUsers, saveNewUser, validateUser, getUser, updateUserRole, getUserById, deleteUserById } = require("./utils/users");
const { getCurrentUser } = require("./auth/auth");
const { sendJson } = require("./utils/responseUtils");
const { getAllProducts } = require("./utils/products.js");

/**
 * Known API routes and their allowed methods
 *
 * Used to check allowed methods and also to send correct header value
 * in response to an OPTIONS request by sendOptions() (Access-Control-Allow-Methods)
 */
const allowedMethods = {
  "/api/register": ["POST"],
  "/api/users": ["GET"],
  "/api/products": ["GET"],
  "/api/cart": ["GET"]
};

/**
 * Send response to client options request.
 *
 * @param {string} filePath pathname of the request URL
 * @param {http.ServerResponse} response
 */
const sendOptions = (filePath, response) => {
  if (filePath in allowedMethods) {
    response.writeHead(204, {
      "Access-Control-Allow-Methods": allowedMethods[filePath].join(","),
      "Access-Control-Allow-Headers": "Content-Type,Accept",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Expose-Headers": "Content-Type,Accept"
    });
    return response.end();
  }

  return responseUtils.notFound(response);
};

/**
 * Does the url have an ID component as its last part? (e.g. /api/users/dsf7844e)
 *
 * @param {string} url filePath
 * @param {string} prefix
 * @returns {boolean}
 */
const matchIdRoute = (url, prefix) => {
  const idPattern = "[0-9a-z]{8,24}";
  const regex = new RegExp(`^(/api)?/${prefix}/${idPattern}$`);
  return regex.test(url);
};

/**
 * Does the URL match /api/users/{id}
 *
 * @param {string} url filePath
 * @returns {boolean}
 */
const matchUserId = url => {
  return matchIdRoute(url, "users");
};

const handleRequest = async (request, response) => {
  const { url, method, headers } = request;
  const filePath = new URL(url, `http://${headers.host}`).pathname;

  // serve static files from public/ and return immediately
  if (method.toUpperCase() === "GET" && !filePath.startsWith("/api")) {
    const fileName = filePath === "/" || filePath === "" ? "index.html" : filePath;
    return renderPublic(fileName, response);
  }

  if (matchUserId(filePath)) {
    // TODO: 8.5 Implement view, update and delete a single user by ID (GET, PUT, DELETE)
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    // throw new Error("Not Implemented");
    const authorize = request.headers["authorization"];
    if (authorize) {
      const credential = getCredentials(request);
      if (credential) {
        const user = getUser(credential[0], credential[1]);
        if (!user) {
          return responseUtils.basicAuthChallenge(response);
        }
        if (user.role === "admin") {
          const userToProcess = getUserById(url.split("/")[3]);
          if (!userToProcess) {
            return responseUtils.notFound(response);
          }

          switch (method.toUpperCase()){
            case "GET":
              return responseUtils.sendJson(response, userToProcess);
            case "PUT": {
              const data = await parseBodyJson(request);
              if (!data.role) {
                return responseUtils.badRequest(response, "Missing role!");
              }
              else if (data.role !== "admin" && data.role !== "customer") {
                return responseUtils.badRequest(response, "Unknown role!");
              }
              return responseUtils.sendJson(
                response,
                updateUserRole(url.split("/")[3], data.role)
              );
            }
            case "DELETE":
              return responseUtils.sendJson(
                response,
                deleteUserById(url.split("/")[3])
              );
          }
        }
        else if (user.role === "customer") {
          return responseUtils.forbidden(response);
        }
        else {
          return responseUtils.notFound(response);
        }
      }
    }
    else {
      return responseUtils.basicAuthChallenge(response);
    }

  }

  // Default to 404 Not Found if unknown url
  if (!(filePath in allowedMethods)) return responseUtils.notFound(response);

  // See: http://restcookbook.com/HTTP%20Methods/options/
  if (method.toUpperCase() === "OPTIONS") return sendOptions(filePath, response);

  // Check for allowable methods
  if (!allowedMethods[filePath].includes(method.toUpperCase())) {
    return responseUtils.methodNotAllowed(response);
  }

  // Require a correct accept header (require 'application/json' or '*/*')
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }

  // GET all users
  if (filePath === "/api/users" && method.toUpperCase() === "GET") {
    // TODO: 8.3 Return all users as JSON
    // TODO: 8.4 Add authentication (only allowed to users with role "admin")
    const authorize = request.headers["authorization"];
    if (authorize) {
      const credential = getCredentials(request);
      if (credential) {
        const user = getUser(credential[0], credential[1]);
        if (!user) {
          return responseUtils.basicAuthChallenge(response);
        }
        if (user.role === "admin") {
          return responseUtils.sendJson(response, getAllUsers());
        }
        if (user.role === "customer") {
          return responseUtils.forbidden(response);
        }
      }
    }
    else {
      return responseUtils.basicAuthChallenge(response);
    }
  }

  //
  if (filePath === "/api/products" && method.toUpperCase() === "GET") {
    const authorize = request.headers["authorization"];
    if (authorize) {
      const credential = getCredentials(request);
      if (credential) {
        const user = getUser(credential[0], credential[1]);
        if (!user) {
          return responseUtils.basicAuthChallenge(response);
        }
        return responseUtils.sendJson(response, getAllProducts());
      }
    }
    return responseUtils.basicAuthChallenge(response);
  }

  // register new user
  if (filePath === "/api/register" && method.toUpperCase() === "POST") {
    // Fail if not a JSON request
    if (!isJson(request)) {
      return responseUtils.badRequest(response, "Invalid Content-Type. Expected application/json");
    }

    // TODO: 8.3 Implement registration
    // You can use parseBodyJson(request) from utils/requestUtils.js to parse request body
    const json = await parseBodyJson(request);
    const validateMsg = validateUser(json);
    const userInuse = emailInUse(json.email);
    if ( validateMsg.length > 0 || userInuse) {
      json["error"] = validateMsg > 0 ? validateMsg : ["Email in use"];
      return responseUtils.badRequest(response, json["error"]);
    }
    else {
      const newUser = saveNewUser(json);
      const updatedUser = { ...newUser, role: "customer" };
      return responseUtils.createdResource(response, updatedUser);
    }
  }
};
module.exports = { handleRequest };
