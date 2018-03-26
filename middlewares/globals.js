/**
 * 获取全局共享数据
 */

const hbs = require('express-hbs')
const { Category, Setting } = require('../models')
const config = require('../config')

module.exports = (req, res, next) => {
  res.locals.config = config

  const user = req.session.user

  hbs.updateTemplateOptions({
    data: { req, res, user }
  })

  Promise.all([
    Setting.getSettings().then(settings => { res.locals.settings = settings }),
    Category.getCascadingTree().then(categories => { res.locals.categories = categories })
  ])
  .then(() => next())
}
