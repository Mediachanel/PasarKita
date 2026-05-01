const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = path.join(__dirname, "..");
const apiDir = path.join(rootDir, "src", "app", "api");
const nextBin = require.resolve("next/dist/bin/next");
const disabledRouteSuffix = ".static-export-disabled";

function walkRoutes(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkRoutes(entryPath);
    }

    return entry.isFile() && entry.name === "route.ts" ? [entryPath] : [];
  });
}

function walkDisabledRoutes(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkDisabledRoutes(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(disabledRouteSuffix)
      ? [entryPath]
      : [];
  });
}

function disableApiRoutes() {
  const routeFiles = walkRoutes(apiDir);

  for (const routeFile of routeFiles) {
    fs.renameSync(routeFile, `${routeFile}${disabledRouteSuffix}`);
  }

  return routeFiles;
}

function restoreApiRoutes(routeFiles) {
  for (const routeFile of routeFiles) {
    const disabledRoute = `${routeFile}${disabledRouteSuffix}`;
    if (fs.existsSync(disabledRoute)) {
      fs.renameSync(disabledRoute, routeFile);
    }
  }
}

const leftoverDisabledRoutes = walkDisabledRoutes(apiDir);

if (leftoverDisabledRoutes.length > 0) {
  throw new Error(
    "Found leftover disabled API route files. Restore them before building."
  );
}

let disabledRoutes = [];

try {
  disabledRoutes = disableApiRoutes();

  const result = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: rootDir,
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
    },
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exitCode = result.status;
  }
} finally {
  restoreApiRoutes(disabledRoutes);
}
