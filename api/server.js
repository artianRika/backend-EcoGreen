var express = require('express')
var app = express()
const PORT = 3000
app.use(express.json());

var list = [
    { 
        "id": 0,
        "lat": 0,
        "lng": 0
    }
]

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id', (req, res) =>{
    const id = req.params.id
    
    const itemExists = list.some(item => item.id === id);

    if (itemExists) {
        return res.status(400).json({ message: 'An item with the same id already exists.' });
    }

    const {lat, lng} = req.body

    if (lat === undefined || lng === undefined) {
        return res.status(400).json({ message: 'Missing required fields: lat and lng' });
    }

    const newData = {id, lat, lng};
    list.push(newData);


    res.status(201).json({ message: 'Data added successfully', newData });
})

app.delete('/locations/:id', (req, res) =>{
    const id = req.params.id;

    var exists = list.find(item => 
        item.id === id
    )

    if(exists){

        list = list.filter(item => item.id !== id);
        res.json({ message: 'Data deleted successfully' });
    }else{
        res.json({ message: 'No data with such id' });
    }

})


app.delete('/locations/:lng/:lat', (req, res) =>{
  
})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
