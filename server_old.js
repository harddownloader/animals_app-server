const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// graphQL
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

const cors = require("cors");
// auth
// var cookieParser = require("cookie-parser");
// var session = require("express-session");
// routes
const routers = require("./routes");
const Owner = require("./models/owner");
const User = require("./models/user");
const ownersFromBackup = require("./ownersBackUp.json");
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

const root = {
  // USERS
  // get all users
  getAllUsers: () => {
    return User.find()
      .exec()
      .then((docs) => {
        console.log("getAllUsers", docs);
        return docs;
      })
      .catch((err) => {
        console.log("getAllUsers error: ", err);
        return { error: err };
      });
  },
  // get user by id
  getUser: ({ id }) => {
    return User.findById(id)
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
  addOwnerToUsersOwnersList({ userId, ownerId }) {
    // get user information
    // check ownerId in list
    // если нету, то пушим и слхраняем

    return 
  },
  deleteOwnerToUsersOwnersList({ userId, ownerId }) {
    // берем юзера
    // проверяем есть ли в его списке владелец с таким индификатором
    // если есть, то удаляем и сохраняем
    return 
  },

  // OWNERS
  // get all owners
  getAllOwners: () => {
    return Owner.find()
      .exec()
      .then((docs) => {
        console.log("getAllOwners", docs);
        return docs;
      })
      .catch((err) => {
        console.log("getAllOwners error: ", err);
        return { error: err };
      });
  },
  // get owner by id
  getOwner: ({ id }) => {
    return Owner.findById(id)
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
  // upload owners from backup file
  upOwnersByBackup: () => {
    for (let i = 0; i < ownersFromBackup.length; i++) {
      const item = ownersFromBackup[i];
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
          return result
        })
        .catch((err) => {
          console.log(err);
          // throw err;
        });
    }

    return {
      status: "loading owners from backup complete!",
    };
  },
  // add owner
  createOwner: ({ input }) => {
    const owner = new Owner({
      _id: new mongoose.Types.ObjectId(),
      name: input.name,
      adress: input.adress,
      phones: input.phones,
      photoOwnerImage: input.photoOwnerImage,
      photoPasportImage: input.photoPasportImage,
      car: input.car,
      history: input.history,
      whoGave: input.whoGave,
      ktoDalTel: input.ktoDalTel,
      jivoder: input.jivoder,
    });
    return owner
      .save()
      .then((result) => {
        console.log('result = ', result);
        console.log(result._id)
        // return { ...result._doc };
        return result
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  // update owner fields
  updateOwner: ({ input }) => {
    const updateOps = {};
    // console.log('input', input)
    for (const ops of Object.keys(input)) {
      updateOps[ops] = input[ops];
    }
    console.log('updateOps', updateOps)
    // return false
    return Owner.updateOne(
      { _id: input.id },
      {
        $set: updateOps,
      }
    )
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
  // delete owner
  deleteOwner: ({ id }) => {
    return Owner.remove({ _id: id })
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
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

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
app.listen(process.env.PORT || 3033, () => console.log("🚀 Server is running..."));
