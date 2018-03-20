const path = require('path')

const hbs = require('express-hbs')

const equalHelper = require('./helpers/equal')
const maskHelper = require('./helpers/mask')
const toFixedHelper = require('./helpers/to-fixed')
const paginationHelper = require('./helpers/pagination')
const categoriesHelper = require('./helpers/categories')

// 注册同步 helper
hbs.registerHelper('equal', equalHelper)
hbs.registerHelper('toFixed', toFixedHelper)
hbs.registerHelper('mask', maskHelper)
hbs.registerHelper('pagination', paginationHelper)

// 注册异步 helper
hbs.registerAsyncHelper('categories',categoriesHelper)

module.exports = hbs.express4({
  // 指定部分页（被载入的模板）所存在的目录
  // 载入方式：{{> member-sidebar}}
  partialsDir: path.join(__dirname, 'views', 'partials')
})
