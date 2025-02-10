import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    if (!client.isConnected()) await client.connect();
  }
  return client.db('cvShowcase');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('contacts');
      const result = await collection.insertOne(req.body);
      res.status(200).json({ message: 'Message saved', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error saving message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
