const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
// const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')

const authenticate = require('./middlewares/authenticate')

const site = require('./routes/site')
const account = require('./routes/account')
const member = require('./routes/member')
const cart = require('./routes/cart')
const order = require('./routes/order')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
// app.set('view options', {
//   layout: 'shared/layout'
// })

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'zce.me', resave: true, saveUninitialized: true }))

app.use('/', site)
app.use('/cart', cart)
app.use('/account', account)
app.use('/member', authenticate, member)
app.use('/order', authenticate,order)

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
  res.render('shared/error')
})

module.exports = app
