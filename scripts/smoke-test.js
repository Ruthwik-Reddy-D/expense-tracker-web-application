const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "server.js",
  "package.json",
  "public/index.html",
  "public/dashboard.html",
  "public/css/styles.css",
  "public/js/auth.js",
  "public/js/dashboard.js",
  ".env.example",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error("Missing required files:", missing);
  process.exit(1);
}

const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");
const envKeys = ["MONGO_URI=", "JWT_SECRET=", "PORT="];
const missingEnv = envKeys.filter((key) => !envExample.includes(key));
if (missingEnv.length) {
  console.error(".env.example missing keys:", missingEnv);
  process.exit(1);
}

console.log("Smoke test passed: required files and env keys present.");
