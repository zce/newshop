/**
 * Home Controller
 */

const { Product } = require('../models')

exports.index = (req, res) => {
  Product.getLikeProducts()
    .then(likes => {
      res.locals.likes = likes
      res.render('index')
    })
}

exports.likes = (req, res) => {
  Product.getLikeProducts()
    .then(likes => res.json(likes))
}
