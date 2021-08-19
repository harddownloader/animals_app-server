const express = require('express')
const mongoose = require("mongoose");
// const controllers = require('../controllers/servers')
const router = express.Router()
const Owner = require('../models/owner');
const User = require('../models/user');

// routes
// router.post('/api/server/get-all', controllers.getAll)
// router.post('/api/server/get-first', controllers.getFirst)

// get all owners
router.get('/owners', (req,res, next) => {
  Owner.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// get by id
router.get('/owners/:ownerId', (req, res, next) => {
  const id = req.params.ownerId;
  Owner.findById(id)
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

// add owner
router.post('/owners', (req, res, next) => {
  console.log('req.body', req.body)
  const owner = new Owner({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    adress: req.body.adress,
    phones: req.body.phones,
    photoOwnerImage: req.body.photoOwnerImage,
    photoPasportImage: req.body.photoPasportImage,
    car: req.body.car,
    history: req.body.history,
    whoGave: req.body.whoGave,
    ktoDalTel: req.body.ktoDalTel,
    jivoder: req.body.jivoder,
  });
  owner.save().then(result => {
    console.log(result)
  })
  .catch(err => console.log(err));
  res.status(201).json({
    message: 'Heading POST to /owners',
    createdOwner: owner
  })
})

/**
 * update owner
 * Позволяет обновить только те поля , что мы укажем
 * 
 * пример запроса(на обновления всех полей):
 * [
    {
        "propName": "name",
        "value": "annaUpdated"
    },
    {
        "propName": "adress",
        "value": "adresss2Updated"
    },
    {
        "propName": "phones",
        "value": [
            "Updated"
        ]
    },
    {
        "propName": "photoOwnerImage",
        "value": "url1Updated"
    },
    {
        "propName": "photoPasportImage",
        "value": "url2Updated"
    },
    {
        "propName": "car",
        "value": "volgaUpdated"
    },
    {
        "propName": "history",
        "value": "hostiriUpdated"
    },
    {
        "propName": "whoGave",
        "value": "vityaUpdated"
    },
    {
        "propName": "ktoDalTel",
        "value": "vasyaUpdated"
    },
    {
        "propName": "jivoder",
        "value": true
    }
]
 */
// update owner fields
router.patch("/owners/:ownerId", (req, res, next) => {
  const id = req.params.ownerId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Owner.update({ _id: id }, {
    $set: updateOps
  })
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
})

// delete owner
router.delete("/owners/:ownerId", (req, res, next) => {
  const id = req.params.ownerId;
  Owner.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
})




// USERS
// get all users
router.get("/users", (req, res, next) => {
  User.find()
  .exec()
  .then(docs => {
    console.log(docs);
    res.status(200).json(docs)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
})

// get user by id
router.get("/users/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    })
})

module.exports = router
