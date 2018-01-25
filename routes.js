const { Router } = require('express')

const siteController = require('./controllers/site')
const accountController = require('./controllers/account')
const memberController = require('./controllers/member')
const cartController = require('./controllers/cart')
const checkoutController = require('./controllers/checkout')

const router = Router()

// home
router.get('/', siteController.index)
router.get('/list/:cat_id(\\d+)', siteController.list)
router.get('/item/:goods_id(\\d+)', siteController.item)

// account
router.get('/account/login', accountController.login)
router.get('/account/register', accountController.register)

// member
router.get('/member', memberController.index)
router.get('/member/profile', memberController.profile)
router.get('/member/address', memberController.address)
router.get('/member/order', memberController.order)

// cart
router.get('/cart', cartController.index)
router.get('/cart/add', cartController.add)

// checkout
router.get('/checkout', checkoutController.index)
router.get('/checkout/pay', checkoutController.pay)

module.exports = router
