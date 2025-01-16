const fs = require("fs");
const path = require("path");

const packagePath = path.resolve(__dirname, "package.json");
const clientsDir = path.resolve(__dirname, "clients");

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
const clients = fs
  .readdirSync(clientsDir)
  .filter((client) => fs.statSync(path.join(clientsDir, client)).isDirectory());

packageJson.exports = {
  ...clients.reduce((exports, client) => {
    exports[`./clients/${client}`] = `./dist/clients/${client}.js`;
    return exports;
  }, {}),
};

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
