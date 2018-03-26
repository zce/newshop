const { Router } = require('express')

// 认证中间件
const auth = require('../middlewares/auth')

// 载入全部控制器
const homeController = require('../controllers/home')
const listController = require('../controllers/list')
const itemController = require('../controllers/item')
const searchController = require('../controllers/search')
const accountController = require('../controllers/account')
const memberController = require('../controllers/member')
const cartController = require('../controllers/cart')
const checkoutController = require('../controllers/checkout')

const commonController = require('../controllers/common')

// 创建路由对象
const router = new Router()

// 路由规则配置
router.get('/', homeController.index)
router.get('/likes', homeController.likes)

router.get('/list/:id', listController.index)

router.get('/item/:id', itemController.index)

router.get('/search', searchController.index)

router.get('/account', accountController.index)
router.get('/account/login', accountController.login)
router.post('/account/login', accountController.loginPost)
router.get('/account/logout', accountController.logout)
router.get('/account/register', accountController.register)
router.post('/account/register', accountController.registerPost)
router.get('/account/active', auth.required, accountController.active)

router.get('/member', auth.required, memberController.index)
router.get('/member/order', auth.required, memberController.order)
router.get('/member/profile', auth.required, memberController.profile)
router.get('/member/address', auth.required, memberController.address)

router.get('/captcha', commonController.captcha)

// 导出路由对象
module.exports = router
