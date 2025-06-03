import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoConnection() {
  console.log("Testing MongoDB connection...");
  
  const uri = process.env.MONGODB_URI;
  console.log("Connection string:", uri.replace(/:[^:]*@/, ':****@')); // Hide password
  
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");
    
    // List databases to verify connection works
    const adminDb = client.db("admin");
    const result = await adminDb.command({ listDatabases: 1 });
    console.log("Available databases:", result.databases.map(db => db.name).join(', '));
    
    await client.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

testMongoConnection();