import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateCompatibility } from './compatibility.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  console.log("Attempting to connect to MongoDB...");
  console.log("Connection string:", uri.replace(/:[^:]*@/, ':****@')); // Hide password in logs
  
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    await client.connect();
    console.log("✅ Successfully connected to MongoDB");
    
    const db = client.db();
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// Compatibility endpoint
app.post('/api/compatibility', async (req, res) => {
  const { name1, name2 } = req.body;

  console.log("★★★ Received names:", name1, name2);
  
  // Log normalized names
  const n1 = name1.replace(/\s+/g, '').toLowerCase();
  const n2 = name2.replace(/\s+/g, '').toLowerCase();
  console.log("★★★ Normalized names:", n1, n2);
  
  // Special case check here for debugging
  if ((n1 === 'suruchi' && n2 === 'abhijeet') || (n1 === 'abhijeet' && n2 === 'suruchi')) {
    console.log("✨ SPECIAL MATCH DETECTED before calling calculateCompatibility!");
  }

  const compatibility = calculateCompatibility(name1, name2);

  console.log("Calculated compatibility:", compatibility);

  try {
    const db = await connectToDatabase();
    const collection = db.collection('compatibilityChecks');

    await collection.insertOne({
      name1,
      name2,
      compatibility,
      createdAt: new Date()
    });

    return res.status(200).json({ compatibility });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
});

// For local testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;