const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let list = [];

app.get('/', (req, res) => {
    res.json(list);
});

app.post('/locations/:id', (req, res) => {
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

    res.status(201).json({ message: 'Data added successfully', newData });
});

app.delete('/locations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const exists = list.some(item => item.id === id);
    if (exists) {
        list = list.filter(item => item.id !== id);
        res.json({ message: 'Data deleted successfully' });
    } else {
        res.status(404).json({ message: 'No data with such ID' });
    }
});

app.delete('/locations/:lat/:lng', (req, res) => {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);

    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: 'Invalid coordinates format' });
    }

    const index = list.findIndex(item => item.lat === lat && item.lng === lng);
    if (index !== -1) {
        list.splice(index, 1);
        res.json({ message: 'Data deleted successfully' });
    } else {
        res.status(404).json({ message: 'No data with such lat and lng' });
    }
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
