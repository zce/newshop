const path = require('path')
const serveStatic = require('serve-static')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const globals = require('./globals')
const auth = require('./auth')

const config = require('../config')

const middlewares = []

// public 文件夹的静态文件服务
middlewares.push(serveStatic(path.join(__dirname, '../public')))

// 请求头中的 cookie 解析
middlewares.push(cookieParser())

// // json 格式请求体解析
// middlewares.push(bodyParser.json())

// urlencoded 格式请求体解析
middlewares.push(bodyParser.urlencoded({ extended: false }))

// 支持 Session
middlewares.push(session({ secret: config.session.secret, resave: false, saveUninitialized: false }))

// 自动获取登录用户信息
middlewares.push(auth.resolve)

// 获取全局所需数据
middlewares.push(globals)

// 导出模块
module.exports = middlewares
