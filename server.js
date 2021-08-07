const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// graphQL
const { graphqlHTTP } = require("express-graphql");
// const {buildSchema}=require('graphql')
const schema = require("./schema");

const cors = require("cors");
// auth
// var cookieParser = require("cookie-parser");
// var session = require("express-session");
// routes
const routers = require("./routes");
const Owner = require("./models/owner");
const User = require("./models/user");
const ownersFromBackup = require('./ownersBackUp.json')
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
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.json());

// const owners = [
//   {
//     id: 1,
//     name: "vitia",
//     adress: "adress2",
//     photoOwnerImage: "url1",
//     photoPasportImage: "url2",
//     car: "car2",
//     history: "history1",
//     whoGave: "vasyadal",
//     ktoDalTel: "+73636363232",
//     jivoder: true,
//   },
//   {
//     id: 2,
//     name: "vitia222",
//     adress: "adress2",
//     photoOwnerImage: "url1",
//     photoPasportImage: "url2",
//     car: "car2",
//     history: "history1",
//     whoGave: "vasyadal",
//     ktoDalTel: "+73636363232",
//     jivoder: true,
//   },
// ];

const root = {
  // getAllUsers: () => {
  //   return [
  //     {
  //       id: 1,
  //       name: 'vitia',
  //       adress: 'adress2',
  //       photoOwnerImage: 'url1',
  //       photoPasportImage: 'url2',
  //       car: 'car2',
  //       history: 'history1',
  //       whoGave: 'vasyadal',
  //       ktoDalTel: '+73636363232',
  //       jivoder: true
  //     },
  //     {
  //       id: 2,
  //       name: 'vitia222',
  //       adress: 'adress2',
  //       photoOwnerImage: 'url1',
  //       photoPasportImage: 'url2',
  //       car: 'car2',
  //       history: 'history1',
  //       whoGave: 'vasyadal',
  //       ktoDalTel: '+73636363232',
  //       jivoder: true
  //     }
  //   ]
  // },
  // getUser: ({id}) => {
  //   return
  // },
  getAllOwners: () => {
    // return [{id:1},{id: 2}]
    return Owner.find()
      .exec()
      .then((docs) => {
        console.log("getAllOwners", docs);
        return docs
        // .map(owner => {
        //   return {...owner._doc}
        // });
      })
      .catch((err) => {
        console.log('getAllOwners error: ', err);
        return { error: err };
      });
  },
  // getOwner: ({id}) => {
  //   return
  // },
  getOwner: ({ id }) => {
    Owner.findById(id)
      .exec()
      .then((doc) => {
        console.log("From database", doc);
        if (doc) {
          return doc;
        } else {
          return { message: "No valid entry found for provided ID" };
        }
      })
      .catch((err) => {
        console.log(err);
        return { error: err };
      });
  },
  createOwner: ({ input }) => {
    for (let i=0; i< ownersFromBackup.length; i++) {
      const item = ownersFromBackup[i]
      // if(i > 0) return 'first return'
      const owner = new Owner({
        _id: new mongoose.Types.ObjectId(),
        name: item.name,
        adress: item.adress,
        phones: item.phone,
        photoOwnerImage: item.photoOwnerImage,
        photoPasportImage: item.photoPasportImage,
        car: item.car,
        history: item.history,
        whoGave: item.whoGave,
        ktoDalTel: item.ktoDalTel,
        jivoder: item.jivoder,
      });
      owner
        .save()
        .then((result) => {
          console.log(result);
          return {...result._doc}
        })
        .catch((err) => {
          console.log(err);
          // throw err;
        });
    }
    return 'yraaa'
    // const owner = new Owner({
    //   _id: new mongoose.Types.ObjectId(),
    //   name: input.name,
    //   adress: input.adress,
    //   phones: input.phones,
    //   photoOwnerImage: input.photoOwnerImage,
    //   photoPasportImage: input.photoPasportImage,
    //   car: input.car,
    //   history: input.history,
    //   whoGave: input.whoGave,
    //   ktoDalTel: input.ktoDalTel,
    //   jivoder: input.jivoder,
    // });
    // return owner
    //   .save()
    //   .then((result) => {
    //     console.log(result);
    //     return {...result._doc}
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     throw err;
    //   });

  },
  hello: () => {
    return "hello world";
  },
};
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
// app.use('/graphql',graphqlHTTP({
//   schema:buildSchema(`
//       type RootQuery{
//           hello:String!
//       }
//       type RootMutation{
//           somemutation:String!
//       }
//       schema{
//           query: RootQuery
//           mutation:RootMutation
//       }
//   `),
//   rootValue:{
//       hello:()=>{
//           return "Hello back"
//       }
//   },
//   graphiql:true
// }))

// mongoose
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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

// app.get("/", function (req, res) {
//   if (req.session.page_views) {
//     req.session.page_views++;
//     res.send("You visited this page " + req.session.page_views + " times");
//   } else {
//     req.session.page_views = 1;
//     res.send("Welcome to this page for the first time!");
//   }
// });

// set static folder
app.use(express.static(path.resolve(__dirname, "static")));

// set api routers
// app.use(routers);

// up server
app.listen(process.env.PORT || 3033, () => console.log("Server is running..."));
