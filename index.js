const express = require("express");
const admin = require("firebase-admin");

// Crear app de express
const app = express();

// Configuración de cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();

  app.options("*", (req, res) => {
    // allowed XHR methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
  console.log("Iniciado!", port);
});

const credentials = require("./permisos.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://xiinbalkiin.firebaseio.com",
});

const db = admin.firestore();

app.get("/api/v1/", (req, res) => {
  console.log(req);
  res.json("INICIADO");
});

app.get("/api/v1/bus/", (req, res) => {
  const id = req.query.idBus;
  const latitud = req.query.latitud;
  const longitud = req.query.longitud;

  db.collection("camiones")
    .doc(id)
    .update({
      latitud: latitud,
      longitud: longitud,
      updated: new Date(),
    })
    .then(() => {
      console.log("REGISTRO EXITOSO");
    })
    .catch((err) => {
      console.log("********************** ERROR *******************************");
      console.log(err);
      console.log("***********************************************************");
    });

  // db.collection("pruebas")
  //   .add(data)
  //   .then(() => {
  //     console.log("REGISTRO EXITOSO");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  res.json({
    status: "ok",
    query: req.query,
  });
});
