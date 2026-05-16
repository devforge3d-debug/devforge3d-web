const fs = require("fs");

const file = "dist/client/wrangler.json";

if (fs.existsSync(file)) {
  fs.unlinkSync(file);
  console.log("Deleted dist/client/wrangler.json");
}