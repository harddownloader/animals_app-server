const express = require('express')
const controllers = require('../controllers/servers')
const router = express.Router()

router.get('/api/server/get-all', controllers.getAll)
router.get('/api/server/get-first', controllers.getFirst)

module.exports = router
