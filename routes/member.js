const { Router } = require('express')
const router = new Router()

const memberController = require('../controllers/member')

router.get('/', memberController.index)

module.exports = router
