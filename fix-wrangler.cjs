const fs = require("fs");

const file = "dist/client/wrangler.json";

if (fs.existsSync(file)) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));

  delete json.triggers;

  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.log("Fixed dist/client/wrangler.json");
}