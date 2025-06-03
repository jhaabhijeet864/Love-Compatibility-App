import { MongoClient } from 'mongodb';

// Use the MONGODB_URI environment variable for your connection string
const uri = process.env.MONGODB_URI;
let cachedDb = null;

/**
 * Connect to MongoDB, caching the connection for subsequent calls.
 */
async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  
  // Use the default database specified in your URI.
  const db = client.db();
  cachedDb = db;
  return db;
}

/**
 * Calculate compatibility based on the two names.
 * 
 * This function:
 * - Removes spaces and lowercases the names.
 * - Calculates a letter score (a=1, b=2, …, z=26)
 * - Uses an exponential decay function on the absolute difference in scores.
 * - Computes the common letter ratio between the two names.
 * - Returns the average of these two factors, clamped to 0-100.
 */
function calculateCompatibility(name1, name2) {
  // Normalize names: remove spaces and convert to lowercase to ensure case-insensitivity.
  const n1 = name1.replace(/\s+/g, '').toLowerCase();
  const n2 = name2.replace(/\s+/g, '').toLowerCase();

  // Helper function to calculate a score for each letter (a=1, b=2, ..., z=26).
  // This function ignores any characters that are not between a and z.
  const getScore = (str) =>
    Array.from(str).reduce((acc, char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return acc + (code - 96);
      }
      return acc;
    }, 0);

  // Calculate the individual scores for both names.
  const score1 = getScore(n1);
  const score2 = getScore(n2);

  // Calculate the absolute difference between the two name scores.
  const diff = Math.abs(score1 - score2);
  
  // Compute a "difference factor" using exponential decay.
  // When the difference is 0, this factor will be 100, and it decreases as the difference increases.
  const diffFactor = Math.floor(Math.exp(-diff / 50) * 100);

  // Calculate how many unique letters are common between the two names.
  const set1 = new Set(n1);
  const set2 = new Set(n2);
  const commonLettersCount = [...set1].filter(letter => set2.has(letter)).length;
  const totalUniqueLetters = new Set([...set1, ...set2]).size;
  
  // Compute the "common letter factor" as a percentage.
  const commonFactor = totalUniqueLetters > 0 ? Math.floor((commonLettersCount / totalUniqueLetters) * 100) : 0;

  // Final compatibility value is the average of our two factors, clamped to a maximum of 100.
  let compatibility = Math.floor((diffFactor + commonFactor) / 2);
  compatibility = Math.min(100, Math.max(0, compatibility));

  return compatibility;
}

/**
 * The handler for the serverless function.
 * It extracts the names from the request, computes the compatibility using our custom logic,
 * stores the data in the MongoDB database, and returns the result as JSON.
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name1, name2 } = req.body;

    // Validate input.
    if (!name1 || !name2) {
      return res.status(400).json({ message: 'Please provide both names.' });
    }

    // Calculate compatibility using our custom function.
    const compatibility = calculateCompatibility(name1, name2);

    try {
      // Connect to MongoDB.
      const db = await connectToDatabase(uri);
      const collection = db.collection('compatibilityChecks');

      // Insert the compatibility record into the database.
      await collection.insertOne({
        name1,
        name2,
        compatibility,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Database insertion error:', error);
      return res.status(500).json({ message: 'Database insertion failed.' });
    }

    // Return the calculated compatibility percentage.
    return res.status(200).json({ compatibility });
  } else {
    // Only allow POST requests.
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Export both the handler (default export) and the calculateCompatibility function (named export)
export { calculateCompatibility };
