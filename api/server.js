const express = require('express');
const app = express();
const PORT = 3000;

//exp
app.use((req, res, next) => {
    // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Allow specific methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Allow specific headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Allow preflight requests to be cached for 24 hours (86400 seconds)
  res.setHeader('Access-Control-Max-Age', '86400');
    next();
  });
const { connectToDatabase, getDb } = require('./database');

app.use(express.json());



connectToDatabase();


async function saveList() {
  const db = getDb();
  try {
    await db.collection('locations').updateOne(
      { _id: 'list' }, 
      { $set: { items: list } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving list to MongoDB', error);
  }
}

app.get('/', async (req, res) => {
    try {
      const db = getDb();
      const result = await db.collection('locations').findOne({ _id: 'list' });
      if (result && result.items) {
        res.json(result.items);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.post('/locations/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    const db = getDb();
    const newData = {
      id,
      ...req.body,
      lat: parseFloat(req.body.lat),
      lng: parseFloat(req.body.lng)
    };
  
    try {
      await db.collection('locations').updateOne(
        { _id: 'list' },
        { $push: { items: newData } }
      );
      res.status(201).json({ message: 'Data added successfully', newData });
    } catch (error) {
      console.error('Error adding data to MongoDB', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.delete('/locations/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
  
    const db = getDb();
    try {
      const result = await db.collection('locations').updateOne(
        { _id: 'list' },
        { $pull: { items: { id } } }
      );
      if (result.modifiedCount === 1) {
        res.json({ message: 'Data deleted successfully' });
      } else {
        res.status(404).json({ message: 'No data with such ID' });
      }
    } catch (error) {
      console.error('Error deleting data from MongoDB', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.delete('/locations/:lat/:lng', async (req, res) => {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
  
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }
  
    const db = getDb();
    try {
      const result = await db.collection('locations').updateOne(
        { _id: 'list' },
        { $pull: { items: { lat, lng } } }
      );
      if (result.modifiedCount === 1) {
        res.json({ message: 'Data deleted successfully' });
      } else {
        res.status(404).json({ message: 'No data with such lat and lng' });
      }
    } catch (error) {
      console.error('Error deleting data from MongoDB', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});