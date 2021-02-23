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

let reasonRawData = fs.readFileSync('./data/why-options.json');
let reasons = JSON.parse(reasonRawData);

app.get('/reasons', (request, response) => {
    response.status(200).send(reasons);
})

let navbarRawData = fs.readFileSync('./data/navbar.json');
let navbar = JSON.parse(navbarRawData);

app.get('/navbar', (request, response) => {
    response.status(200).send(navbar);
})

// let aboutRawData = fs.readFileSync('./data/about.json');
// let about = JSON.parse(aboutRawData);

// app.get('/about', (request, response) => {
//     response.status(200).send(about);
// })

// let filterRawData = fs.readFileSync('./data/menu-filters.json');
// let filters = JSON.parse(filterRawData);

// app.get('/menu/filters', (request, response) => {
//     response.status(200).send(filters);
// })

let photosRawData = fs.readFileSync('./data/photos.json');
let photos = JSON.parse(photosRawData);

app.get('/photos', (request, response) => {
    response.status(200).send(photos);
})

// let chefRawData = fs.readFileSync('./data/chefs.json');
// let chefs = JSON.parse(chefRawData);

// app.get('/chefs', (request, response) => {
//     response.status(200).send(chefs);
// })



const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

// initialize admin SDK using serciceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/*const getChefs = async (req, res) => {
    try {
      const chefs = await db.collection('chefs').get().then(docs => {
        let arr = [];

        docs.forEach(doc => {
          arr.push(
            doc.data()
          );
        });

        return arr;
      });

      return res.status(200).json(chefs)
    } catch(error) { return res.status(500).json(error.message) }
  }*/

const getChefs = getCollection('chefs');
const getAbout = getCollection('about');
const menuFilters = getCollection('menu-filters');
app.get('/about', getAbout);
app.get('/chefs', getChefs);
app.get('/menu/filters', menuFilters);

function getCollection(col) {
    const resp = async (req, res) => {
        try {
          const data = await db.collection(col).get().then(docs => {
            let arr = [];
    
            docs.forEach(doc => {
              arr.push(
                doc.data()
              );
            });
    
            return arr;
          });
    
          return res.status(200).json(data);
        } catch(error) { return res.status(500).json(error.message) }
      }

      return resp;
}

http.createServer(app).listen(8001, () => {
    console.log('Server started at http://localhost:8001');
})