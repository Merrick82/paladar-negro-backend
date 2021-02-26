var express = require('express');
var http = require('http');
var cors = require('cors');
const bodyParser = require("body-parser");
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

// initialize admin SDK using serviceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.status(200).send("Bienvenido a tu API REST!");
})

// Endpoints que traen de firebase las colecciones a renderizar en el frontend
app.get('/about', getCollection('about'));
app.get('/chefs', getCollection('chefs'));
app.get('/menu/filters', getCollection('menu-filters'));
app.get('/navbar', getCollection('navbar'));
app.get('/reasons', getCollection('reasons'));
app.get('/specials', getCollection('specials'));
app.get('/menu', getCollection('menu'));
app.get('/photos', getCollection('photos'));

// Endpoint que inserta la reserva solicitada
app.post('/book', insert('book-table'));

// Endpoint que busca una reserva
app.post('/search/booked', searchBookedTable());

function insert(dbName) {
  const resp = async (req, res) => {

    try {
      let booked = {
        name: req.body.name,
        mail: req.body.mail,
        telephone: req.body.telephone,
        day: req.body.day,
        month: req.body.month,
        hour: req.body.hour,
        people: req.body.people,
        message: req.body.message
      }

      const data = await db.collection(dbName).add(booked).then(({id}) => {
        console.log('Resultado: ', id);
        return id;
      });
      
      return res.status(200).json(data);
    } catch(error) { return res.status(500).json(error.message) }
  }

  return resp;
}

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

function searchBookedTable() {
  const resp = async (req, res) => {
    let param = req.body.id;
    
    try {
      console.log('searchBookedTable', param);
      const data = await db.collection('book-table').doc(param).get().then(doc => {
        if (doc.exists) {
          return doc.data();
        }
      });

      return res.status(200).json(data);
    } catch(error) { return res.status(500).json(error.message) }
  }

  return resp;
}

/* Metodo que inserta masivamente en firestore leyendo 
   los archivos json que estaban localmente

massiveInsert(navbar, 'navbar');
massiveInsert(reasons, 'reasons');
massiveInsert(specials, 'specials');
massiveInsert(menu, 'menu');
massiveInsert(photos, 'photos');

function massiveInsert(toSave, dbName) {
  toSave.forEach(data => {
    db.collection(dbName).add(data)
                .catch(e => console.log(e));
  });
}*/

http.createServer(app).listen(8001, () => {
    console.log('Server started at http://localhost:8001');
})