var express = require('express')
var app = express()
const PORT = 3000
app.use(express.json());

var list = []

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    
    const itemExists = list.some(item => item.id === id);

    if (itemExists) {
        return res.status(400).json({ message: 'An item with the same id already exists.' });
    }

    let {fullName, locationName, lat, lng} = req.body
    lat = parseFloat(lat)
    lng = parseFloat(lng)

    if (lat === undefined || lng === undefined) {
        return res.status(400).json({ message: 'Missing required fields: lat and lng' });
    }

    const newData = {id, fullName, locationName, lat, lng};
    list.push(newData);


    res.status(201).json({ message: 'Data added successfully', newData });
})

app.delete('/locations/:id', (req, res) =>{
    const id = parseInt(req.params.id);

    const exists = list.find(item => 
        item.id === id
    )

    if(exists){

        list = list.filter(item => item.id !== id);
        res.json({ message: 'Data deleted successfully' });
    }else{
        res.json({ message: 'No data with such id' });
    }

})


app.delete('/locations/:lat/:lng', (req, res) =>{
    const lat = parseFloat(req.params.lat); 
    const lng = parseFloat(req.params.lng);

    const index = list.findIndex(item => item.lat === lat && item.lng === lng);

    if (index !== -1) {
        list.splice(index, 1);
        res.json({ message: 'Data deleted successfully' });
    } else {
        res.json({ message: 'No data with such lat and lng' });
    }
})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
