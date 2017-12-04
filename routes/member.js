const { Router } = require('express')
const router = new Router()

const memberController = require('../controllers/member')

router.get('/', memberController.index)
router.get('/order', memberController.order)
router.get('/profile', memberController.profile)
router.post('/profile', memberController.profilePost)
router.get('/address', memberController.address)
router.post('/address', memberController.addressPost)
router.get('/active', memberController.active)

module.exports = router
