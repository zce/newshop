/**
 * 获取全局共享数据
 */

const hbs = require('express-hbs')
const { Setting, Category, Cart, Product } = require('../models')
const config = require('../config')

function getCart (req, res) {
  return Promise.resolve()
    .then(() => {
      // 在线购物车
      if (req.session.user) return Cart.get(req.session.user.id)

      // 离线购物车
      const cart = req.cookies[config.cookie.cart_key] || []
      const tasks = cart.map(item => Product.getProduct(item.id).then(product => ({
        id: product.id,
        name: product.name,
        thumbnail: product.thumbnail,
        price: product.price,
        amount: item.amount,
        total: product.price * item.amount
      })))
      return Promise.all(tasks)
    })
    .then(cart => {
      res.locals.cart = {
        products: cart,
        totalPrice: cart.reduce((sum, next) => sum + parseFloat(next.total), 0),
        totalAmount: cart.reduce((sum, next) => sum + parseInt(next.amount), 0)
      }
    })
}

function getSettings (req, res) {
  return Setting.getSettings().then(settings => { res.locals.settings = settings })
}

function getCategories (req, res) {
  return Category.getCascadingTree().then(categories => { res.locals.categories = categories })
}

module.exports = (req, res, next) => {
  res.locals.config = config

  const user = req.session.user

  hbs.updateTemplateOptions({
    data: { req, res, user }
  })

  Promise.all([
    getCart(req, res),
    getSettings(req, res),
    getCategories(req, res)
  ])
    .then(() => next())
}
