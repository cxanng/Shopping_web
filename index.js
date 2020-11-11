const http = require("http");
const { handleRequest } = require("./routes");
const { connectDB, disconnectDB } = require("./models/db");

const PORT = process.env.PORT || 3000;
connectDB();
const server = http.createServer(handleRequest);

server.on("error", err => {
  console.error(err);
  server.close();
});

server.on("close", disconnectDB);

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
