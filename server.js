const path = require('path')
require('dotenv').config()
const express = require("express")
const serverRoutes = require('./routes')
// firebase
var admin = require('firebase-admin')

// firebase
var serviceAccount = require("./configs/serviceAccountKey.json");
// init firebase app
var defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_HOST
});

// console.log(defaultApp.name);

// Retrieve services via the defaultApp variable...
var defaultAuth = defaultApp.auth()
var defaultDatabase = defaultApp.database()

// ... or use the equivalent shorthand notation
defaultAuth = admin.auth()
defaultDatabase = admin.database()

// express
const app = express()

// set static folder
app.use(express.static(path.resolve(__dirname, "static")))

// set api routers
app.use(serverRoutes)

// up server
app.listen(process.env.PORT || 3000, 
  () => console.log("Server is running..."))

