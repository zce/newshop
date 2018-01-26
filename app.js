const debug = require('debug')('newshop:app')
const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
// const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const hbs = require('hbs')

const config = require('./config')
const helpers = require('./helpers')
const categoriesHelper = require('./helpers/categories')

const account = require('./middlewares/account')
const cart = require('./middlewares/cart')

const siteRouter = require('./routes/site')
const accountRouter = require('./routes/account')
const memberRouter = require('./routes/member')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')

const app = express()

/**
 * view engine setup
 */

// 公共模版变量 @key 获取
app.locals.site_name = 'Itcast Shop'
// 利用公共变量设置默认模版
app.locals.layout = 'shared/layout'
app.locals.config = config
// 将app的locals中所有的属性都作为模版的变量
// 此处的变量设置是全局的
hbs.localsAsTemplateData(app)

hbs.registerHelper(helpers)
hbs.registerAsyncHelper('categories', categoriesHelper)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

/**
 * 载入功能型中间件
 */

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'zce.me', resave: true, saveUninitialized: true }))

/**
 * 载入路由
 */

// resolve logged in user
app.use(account.resolve)

// resolve cart info
app.use(cart)

app.use('/', siteRouter)
app.use('/cart', cartRouter)
app.use('/account', accountRouter)

// required login
app.use(account.required)
app.use('/member', memberRouter)
app.use('/order', orderRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('shared/error', { layout: null })
  debug(err)
})

module.exports = app

// update sp_goods, sp_goods_pics 
// set sp_goods.goods_big_logo = sp_goods_pics.pics_big, sp_goods.goods_small_logo = sp_goods_pics.pics_sma
// where sp_goods.goods_id = sp_goods_pics.goods_id
