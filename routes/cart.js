const { Router } = require('express')
const router = new Router()

const cartController = require('../controllers/cart')

router.get('/', cartController.index)
router.get('/add', cartController.add)

module.exports = router
