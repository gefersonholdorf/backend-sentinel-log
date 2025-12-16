
import { MongoClient } from "mongodb";
import { env } from "../../env";

async function createCollection() {
  const mongoClient = new MongoClient(env.MONGO_URL);

  try {
    const client = await mongoClient.connect();
    if (!client) throw new Error("MongoDB connection failed.");

    const db = client.db(); 

    const collectionName = "logs";

    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    
    if (!collectionExists) {
      await db.createCollection("logs");
      console.log(`Collection "${collectionName}" create successfully.`);
    } else {
      console.log(`Collection "${collectionName}" it already exists.`);
    }
  } catch (error) {
    console.error("Error creating collection:", error);
  } finally {
    await mongoClient.close();
  }
}

createCollection();