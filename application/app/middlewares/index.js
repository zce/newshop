const path = require('path')
const serveStatic = require('serve-static')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const globals = require('./globals')

const config = require('../config')

const middlewares = []

// public static serve
middlewares.push(serveStatic(path.join(__dirname, '../public')))

// Cookie parser
middlewares.push(cookieParser())

// // application/json request body parser
// middlewares.push(bodyParser.json())

// application/x-www-form-urlencoded request body parser
middlewares.push(bodyParser.urlencoded({ extended: false }))

// Session support
middlewares.push(session({ secret: config.session.secret, resave: false, saveUninitialized: false }))

// got globals
middlewares.push(globals)

// export all middlewares
module.exports = middlewares
