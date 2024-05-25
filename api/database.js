const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@cluster0.gekwwv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('nodetuts'); //CHECKKK
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDatabase, getDb };