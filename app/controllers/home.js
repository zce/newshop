/**
 * Home Controller
 */

const { Product } = require('../models')

/**
 * 首页
 *
 * GET /
 */
exports.index = (req, res, next) => {
  Product.getLikeProducts()
    .then(likes => {
      res.locals.likes = likes
      res.render('home')
    })
    .catch(next)
}

/**
 * 猜你喜欢数据接口（AJAX）
 *
 * GET /likes
 */
exports.likes = (req, res, next) => {
  Product.getLikeProducts()
    .then(likes => res.json(likes))
    .catch(next)
}
