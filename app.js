/**
 * 应用程序对象配置
 * https://www.imooc.com/article/13313
 */

// 内置模块依赖
const express = require('express')

const hbsEngine = require('./engine')
const middlewares = require('./middlewares')

// 载入路由表
const routes = require('./routes')

// 创建应用程序对象
const app = express()

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

// 处理 404 请求，转发到错误处理器
app.use((req, res) => {
  const err = new Error('Not Found')
  err.status = 404
  throw err
})

// 错误处理器
app.use((err, req, res, next) => {
  res.locals.status = err.status || 500
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(res.locals.status).render('error')
})

// 导出应用程序对象
module.exports = app
