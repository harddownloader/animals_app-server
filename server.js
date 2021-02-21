require('dotenv').config()
const express = require("express")
// firebase
var admin = require('firebase-admin');

// firebase
var serviceAccount = require("./configs/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_HOST
});

console.log(defaultApp.name);

// express
const app = express()

app.use(express.static("public"))

app.get("/", function(req, res) {
  res.send("<h1>hello world</h1>")
})

app.listen(process.env.PORT || 3000, 
  () => console.log("Server is running..."))

