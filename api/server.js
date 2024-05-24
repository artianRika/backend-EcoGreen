var express = require('express')
var app = express()
const PORT = 3000

var list = [{"elo": "there"}]

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id', (req, res) =>{
    const id = req.params.id
    const newData = req.body

    list.push({id, ...newData})
    res.status(201).json({ message: 'Data added successfully', list });
})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
