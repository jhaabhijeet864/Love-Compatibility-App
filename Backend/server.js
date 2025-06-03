import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { calculateCompatibility } from './compatibility.js';
import path from 'path';
import { fileURLToPath } from 'url';

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
  
  try {
    const client = new MongoClient(uri);
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

// API endpoint for compatibility
app.post('/api/compatibility', async (req, res) => {
  const { name1, name2 } = req.body;

  console.log("Received names:", name1, name2);
  
  if (!name1 || !name2) {
    return res.status(400).json({ message: 'Please provide both names.' });
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

// Serve static files (for local development)
if (process.env.NODE_ENV !== 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../UI')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../UI/index.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;