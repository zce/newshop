/**
 * Route mappings
 */

const { Router } = require('express')

// auth middleware
const auth = require('../middlewares/auth')

/**
 * Load controllers
 */

const home = require('../controllers/home')
const list = require('../controllers/list')
const item = require('../controllers/item')
const account = require('../controllers/account')
const member = require('../controllers/member')
const cart = require('../controllers/cart')
const checkout = require('../controllers/checkout')
const order = require('../controllers/order')
const pay = require('../controllers/pay')

const common = require('../controllers/common')

/**
 * Create router object
 */

const router = new Router()

// resolve logged in user info for all route
router.use(auth.resolve)

/**
 * mapping rules
 */

// home page
router.get('/', home.index)
router.get('/likes', home.likes)

// list page
router.get('/list/:id(\\d+)', list.index)
router.get('/search', list.search)

// item page
router.get('/item/:id(\\d+)', item.index)

// account center
router.get('/account', account.index)
router.get('/account/login', account.login)
router.post('/account/login', account.loginPost)
router.get('/account/register', account.register)
router.post('/account/register', account.registerPost)
router.get('/account/logout', account.logout)
router.get('/account/active', auth.required, account.active)

// shopping cart
router.get('/cart', cart.index)
router.get('/cart/add', cart.add)
router.get('/cart/delete', cart.delete)
router.get('/cart/update', cart.update)

// order
router.get('/checkout', auth.required, checkout.index)
router.get('/order', auth.required, order.index)
router.get('/order/address', auth.required, order.address)

// pay
router.get('/pay', auth.required, pay.index)
router.get('/pay/callback', auth.required, pay.callback)
router.all('/pay/notify', pay.notify)

// member center
router.get('/member', auth.required, member.index)
router.get('/member/order', auth.required, member.order)
router.get('/member/profile', auth.required, member.profile)
router.post('/member/profile', auth.required, member.profilePost)
router.get('/member/address', auth.required, member.address)
router.post('/member/address', auth.required, member.addressPost)
router.get('/member/address/delete', auth.required, member.addressDelete)

// common actions
router.get('/captcha', common.captcha)

/**
 * export router
 */

module.exports = router
