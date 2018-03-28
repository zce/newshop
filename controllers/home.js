/**
 * Home Controller
 */

const { Product } = require('../models')

/**
 * GET /
 */
exports.index = (req, res) => {
  Product.getLikeProducts()
    .then(likes => {
      res.locals.likes = likes
      res.render('index')
    })
}

/**
 * GET /likes
 */
exports.likes = (req, res) => {
  Product.getLikeProducts()
    .then(likes => res.json(likes))
}
