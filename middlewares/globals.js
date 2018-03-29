/**
 * 获取全局共享数据
 */

const hbs = require('express-hbs')

const config = require('../config')
const { Setting, Category, Cart, Product } = require('../models')

// 获取购物车信息
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

// 获取网站配置信息
function getSettings (req, res) {
  return Setting.getSettings().then(settings => { res.locals.settings = settings })
}

// 获取分类数据
function getCategories (req, res) {
  // TODO: 数据缓存
  return Category.getCascadingTree().then(categories => { res.locals.categories = categories })
}

module.exports = (req, res, next) => {
  hbs.updateTemplateOptions({
    data: {
      get req () {
        return req
      },
      get res () {
        return res
      },
      get user () {
        // must be a getter
        return req.session.user
      }
    }
  })

  res.locals.config = config

  Promise.all([
    getCart(req, res),
    getSettings(req, res),
    getCategories(req, res)
  ])
    .then(() => next())
}
