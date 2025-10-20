// seed.js  (replace-all)
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();

(async () => {
  try {
    const data = JSON.parse(fs.readFileSync("./items_from_images.json", "utf8"));
    if (!Array.isArray(data)) throw new Error("JSON must be an array");

    await mongoose.connect(process.env.MONGO_URI); 
    const col = mongoose.connection.db.collection("items");

    const r = await col.insertMany(data);
    console.log("Inserted:", r.insertedCount);
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect().catch(() => {});
    process.exit(0);
  }
})();
