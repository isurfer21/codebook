#!/usr/bin/env node

// Import required modules
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const codeRunner = require("./api/code-runner");
const codeLanguages = require("./api/code-languages");
const minimist = require("minimist");
const path = require("path");

// Capture all command-line arguments
const argv = minimist(process.argv.slice(2));

// Create an instance of Express
const app = express();

// Middleware setup
app.use(express.json());

// Server config
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.post("/api/run", codeRunner);
app.get("/api/langs", codeLanguages);

if (!!argv.dev) {
  // Proxy dev server
  const appServerUrl = `http://${host}:3000`;
  app.use(
    ["/", "/static/*"],
    createProxyMiddleware({ target: appServerUrl, changeOrigin: true })
  );
} else {
  app.use("/", express.static(path.join("app", "build")));
}

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running at ${host}:${port}`);
});
