const express = require('express');
const app = express();
const PORT = 3000;

const { connectToDatabase, getDb } = require('./database');

app.use(express.json());

let list = [];


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
  res.json(list);
});

app.post('/locations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const itemExists = list.some(item => item.id === id);
  if (itemExists) {
    return res.status(400).json({ message: 'An item with the same ID already exists.' });
  }

  let { fullName, locationName, lat, lng } = req.body;
  lat = parseFloat(lat);
  lng = parseFloat(lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: 'Missing or invalid required fields: lat and lng' });
  }

  const newData = { id, fullName, locationName, lat, lng };
  list.push(newData);

  await saveList(); 

  res.status(201).json({ message: 'Data added successfully', newData });
});

app.delete('/locations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const exists = list.some(item => item.id === id);
  if (exists) {
    list = list.filter(item => item.id !== id);
    await saveList(); 
    res.json({ message: 'Data deleted successfully' });
  } else {
    res.status(404).json({ message: 'No data with such ID' });
  }
});

app.delete('/locations/:lat/:lng', async (req, res) => {
  const lat = parseFloat(req.params.lat);
  const lng = parseFloat(req.params.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: 'Invalid coordinates format' });
  }

  const index = list.findIndex(item => item.lat === lat && item.lng === lng);
  if (index !== -1) {
    list.splice(index, 1);
    await saveList(); 
    res.json({ message: 'Data deleted successfully' });
  } else {
    res.status(404).json({ message: 'No data with such lat and lng' });
  }
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});