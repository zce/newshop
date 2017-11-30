const { Router } = require('express')
const router = new Router()

const memberController = require('../controllers/member')

router.get('/', memberController.index)
router.get('/order', memberController.order)
router.get('/profile', memberController.profile)
router.get('/address', memberController.address)

module.exports = router
