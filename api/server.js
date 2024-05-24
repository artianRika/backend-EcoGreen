var express = require('express')
var app = express()
const PORT = 3000
app.use(express.json());

var list = [
    { 
        "id": "00",
        "lat": 0,
        "lng": 0
    }
]

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id', (req, res) =>{
    const id = req.params.id
    const {lat, lng} = req.body

    if (lat === undefined || lng === undefined) {
        return res.status(400).json({ message: 'Missing required fields: lat and lng' });
    }

    const newData = {id, lat, lng};
    list.push(newData);


    res.status(201).json({ message: 'Data added successfully', newData });
})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
