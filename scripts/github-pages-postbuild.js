const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");
const indexPath = path.join(outDir, "index.html");
const fallbackPath = path.join(outDir, "404.html");
const nojekyllPath = path.join(outDir, ".nojekyll");

if (!fs.existsSync(indexPath)) {
  throw new Error("Static export did not create out/index.html");
}

fs.copyFileSync(indexPath, fallbackPath);
fs.closeSync(fs.openSync(nojekyllPath, "w"));

console.log("GitHub Pages export ready: index.html, 404.html, and .nojekyll created in out/");
