const express = require('express')
const mongoose = require("mongoose");
const controllers = require('../controllers/servers')
const router = express.Router()
const Owner = require('../models/owner');

// routes
router.post('/api/server/get-all', controllers.getAll)
router.post('/api/server/get-first', controllers.getFirst)


router.get('/owners', (req,res, next) => {
  res.status(200).json({
    message: 'Heading GET requests to /owners'
  });
});

router.post('/owners/add', (req, res, next) => {
  // const owner = {
  //   name: req.body.name,
  //   phones: req.body.phones
  // }
  console.log('req.body', req.body)
  // res.json(req.body)
  // res.send('hello world', req.body.name)
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

module.exports = router
