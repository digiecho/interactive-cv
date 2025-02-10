import { MongoClient, ServerApiVersion } from 'mongodb';

// Load MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI;

// Create a MongoClient with Stable API options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('cvShowcase'); // Change to match your database name
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('contacts');

      // Ensure required fields exist
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Insert data into MongoDB
      const result = await collection.insertOne({ name, email, message, createdAt: new Date() });

      res.status(200).json({ message: 'Message saved successfully', result });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
