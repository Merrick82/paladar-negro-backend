var express = require('express');
var http = require('http');
var cors = require('cors');
const fs = require('fs');
var app = express();
app.use(cors());

app.get('/', (request, response) => {
    response.status(200).send("Bienvenido a tu API REST!");
})

let menuRawData = fs.readFileSync('./data/menu-plate.json');
let menu = JSON.parse(menuRawData);

app.get('/menu', (request, response) => {
    response.status(200).send(menu);
})

let specialRawData = fs.readFileSync('./data/menu-special.json');
let specials = JSON.parse(specialRawData);

app.get('/specials', (request, response) => {
    response.status(200).send(specials);
})

http.createServer(app).listen(8001, () => {
    console.log('Server started at http://localhost:8001');
})