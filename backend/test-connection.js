const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user:user123@lootgenerator.dbn11j4.mongodb.net/?retryWrites=true&w=majority&appName=LootGenerator";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);