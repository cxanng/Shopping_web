/**
 * Decode and return JWT token from Authorization hear
 *
 * @param {http.incomingMessage} request request object
 * @returns {string|null} token or null if token is missing
 */
const getCredentials = request => {
  if (!request.headers["authorization"]) {
    return null;
  }
  const code = request.headers["authorization"];
  if (!code.startsWith("bearer ")) {
    return null;
  }
  return code.substring(7);
};

/**
 * Does the client accept JSON responses?
 *
 * @param {http.incomingMessage} request request object
 * @returns {boolean} true if client accepts JSON response
 */
const acceptsJson = request => {
  // TODO: 8.3 Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!
  // throw new Error('Not Implemented');
  if (!Object.keys(request.headers).includes("accept")) {
    return false;
  }
  const accept = request.headers.accept;
  if (accept.includes("application/json") || accept.includes("*/*")) {
    return true;
  }
  return false;
};

/**
 * Is the client request content type JSON?
 *
 * @param {http.incomingMessage} request request object
 * @returns {boolean} true if the request from client is in type JSON
 */
const isJson = request => {
  // TODO: 8.3 Check whether request "Content-Type" is JSON or not
  const head = request.headers;
  if (!Object.keys(head).includes("content-type")) {
    return false;
  }
  if (head["content-type"].includes("application/json")) {
    return true;
  }
  return false;
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {http.IncomingMessage} request request object
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("error", err => reject(err));

    request.on("data", chunk => {
      body += chunk.toString();
    });

    request.on("end", () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };
