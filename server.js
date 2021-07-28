const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
// auth
// var cookieParser = require("cookie-parser");
// var session = require("express-session");
// routes
const routers = require("./routes");
// firebase
// var admin = require("firebase-admin");

// firebase
// var serviceAccount = require("./configs/serviceAccountKey.json");
// init firebase app
// var defaultApp = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: process.env.FIREBASE_HOST,
// });

// console.log(defaultApp.name);

// Retrieve services via the defaultApp variable...
// var defaultAuth = defaultApp.auth();
// var defaultDatabase = defaultApp.database();

// ... or use the equivalent shorthand notation
// defaultAuth = admin.auth();
// defaultDatabase = admin.database();

// express
const app = express();

// support body fields
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// mongoose
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// app.use(cookieParser());
// app.use(
//   session({
//     secret: "Shh, its a secret!",
//     //   store: sessionStore, // connect-mongo session store
//     proxy: true,
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.get("/", function (req, res) {
  if (req.session.page_views) {
    req.session.page_views++;
    res.send("You visited this page " + req.session.page_views + " times");
  } else {
    req.session.page_views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

// set static folder
app.use(express.static(path.resolve(__dirname, "static")));

// set api routers
app.use(routers);

// up server
app.listen(process.env.PORT || 3033, () => console.log("Server is running..."));
