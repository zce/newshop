/**
 * 获取全局共享数据
 */

const hbs = require('express-hbs')
const { Category, Setting } = require('../models')

module.exports = (req, res, next) => {
  hbs.updateTemplateOptions({
    data: { req, res }
  })

  Promise.all([
    Setting.getSettings().then(settings => { res.locals.settings = settings }),
    Category.getCascadingTree().then(categories => { res.locals.categories = categories })
  ])
  .then(() => next())
}
