var express = require('express')
var app = express()
const PORT = 3000

var list = [{"elo": "there"}]

app.get('/', (req, res) =>{
    res.json(list)
})

app.post('/locations/:id', (req, res) =>{

})

app.listen(PORT, ()=>{
    console.log("running on port", PORT)
})
