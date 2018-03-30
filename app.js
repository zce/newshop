/**
 * 应用程序对象配置
 * https://www.imooc.com/article/13313
 */

// 内置模块依赖
const express = require('express')

const hbsEngine = require('./engine')
const middlewares = require('./middlewares')
const error = require('./middlewares/error')

// 载入路由表
const routes = require('./routes')

// 创建应用程序对象
const app = express()

// 额外配置
app.set('x-powered-by', false)
app.set('strict routing', true)

// 配置应用所使用的模板引擎
app.set('view engine', 'hbs')

// 配置模板文件所在目录
app.set('views', './views')

// 配置 hbs 模板文件的模板引擎
app.engine('hbs', hbsEngine)

// 载入所需的中间件
app.use(middlewares)

// 挂载路由表
app.use(routes)

// 错误处理
app.use(error)

// 导出应用程序对象
module.exports = app
