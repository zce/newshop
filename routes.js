const { Router } = require('express')

// 载入全部控制器
const homeController = require('./controllers/home')

// 创建路由对象
const router = new Router()

// 路由规则配置
router.get('/', homeController.index)

// 导出路由对象
module.exports = router
