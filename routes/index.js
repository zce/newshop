const { Router } = require('express')

// 载入全部控制器
const homeController = require('../controllers/home')
const listController = require('../controllers/list')
const itemController = require('../controllers/item')

// 创建路由对象
const router = new Router()

// 路由规则配置
router.get('/', homeController.index)
router.get('/likes', homeController.likes)

router.get('/list/:id', listController.index)

router.get('/item/:id', itemController.index)

// 导出路由对象
module.exports = router
