// Import required modules
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const codeRunner = require("./api/code-runner");
const minimist = require("minimist");
const path = require("path");

// Capture all command-line arguments
const argv = minimist(process.argv.slice(2));

// Create an instance of Express
const app = express();

// Middleware setup
app.use(express.json());

// Server port
const port = process.env.PORT || 4000;

app.post("/api/run", codeRunner);

if (!!argv.dev) {
  // Proxy server
  const appServerUrl = "http://localhost:3000";
  app.use(
    ["/", "/static/*"],
    createProxyMiddleware({ target: appServerUrl, changeOrigin: true })
  );
} else {
  app.use("/", express.static(path.join("app", "build")));
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
