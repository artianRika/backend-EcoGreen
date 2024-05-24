var express = require('express')
var app = express()
const PORT = 3000

var list = [{"elo": "there"}]

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id/:lat/:lng/', (req, res) =>{
    const id = req.params.id
    const lat = re.params.lat 
    const lng = re.params.lng 
    const newData = req.body

    console.log(newData)

    list.push({id, lat,lng})

    res.status(201).json({ message: 'Data added successfully', list });
})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
