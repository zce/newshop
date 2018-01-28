/**
 * 应用程序对象配置
 */

// 内置模块依赖
const path = require('path')

// 载入第三方依赖模块
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const hbs = require('express-hbs')

// 载入路由表
const routes = require('./routes')

// 创建应用程序对象
const app = express()

// 配置应用所使用的模板引擎
app.set('view engine', 'hbs')

// 配置模板文件所在目录
app.set('views', path.join(__dirname, 'views'))

// 配置 hbs 模板文件的模板引擎
app.engine('hbs', hbs.express4({
  // 部分页文件所在目录
  partialsDir: path.join(app.get('views'), 'partials')
}))

// 载入所需的中间件

// 请求日志
app.use(morgan('dev'))

// json 格式请求体解析
app.use(bodyParser.json())

// urlencoded 格式请求体解析
app.use(bodyParser.urlencoded({ extended: false }))

// 请求头中的 cookie 解析
app.use(cookieParser())

// public 文件夹的静态文件服务
app.use(express.static(path.join(__dirname, 'public')))

// 挂载路由表
app.use(routes)

// 处理 404 请求，转发到错误处理器
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// 错误处理器
app.use((err, req, res, next) => {
  res.locals.status = err.status || 500
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // 设置 HTTP 状态码并渲染错误页面
  res.status(res.locals.status).render('error')
})

// 导出应用程序对象
module.exports = app
