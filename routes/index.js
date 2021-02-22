const express = require('express')
const controllers = require('../controllers/servers')
const router = express.Router()

// routes
router.post('/api/server/get-all', controllers.getAll)
router.post('/api/server/get-first', controllers.getFirst)

module.exports = router
