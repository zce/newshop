/**
 * Module dependencies
 */

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const hbs = require('express-hbs')

const routes = require('./routes')

/**
 * root app
 */

const app = express()

/**
 * view engine setup
 */

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', hbs.express4({
  partialsDir: path.join(app.get('views'), 'partials')
}))

/**
 * use middlewares
 */

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * mount routes
 */

app.use(routes)

/**
 * catch 404 and forward to error handler
 */

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

/**
 * error handler
 */

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.status = err.status || 500
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(res.locals.status)
  res.render('error')
})

/**
 * export app
 */

module.exports = app
