const path = require('path')

const hbs = require('express-hbs')
const helpers = require('./helpers')

// 注册同步 helper
hbs.registerHelper(helpers.sync)

// 注册异步 helper
for (const name in helpers.async) {
  hbs.registerAsyncHelper(name, helpers.async[name])
}

// 导出视图引擎对象
module.exports = hbs.express4({
  blockHelperName: 'block',
  contentHelperName: 'contentFor',
  partialsDir: path.join(__dirname, 'views', 'partials'),
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  beautify: true
})
