/**
 * Cart Controller
 */

const createError = require('http-errors')

const { Product } = require('../models')
const config = require('../config')

// GET /cart
exports.index = (req, res) => {
  const cart = req.cookies[config.cookie.cart_key] || []

  const tasks = cart.map(item => Product.getProduct(item.id).then(product => ({
    id: product.id,
    name: product.name,
    thumbnail: product.thumbnail,
    price: product.price,
    amount: item.amount,
    total: product.price * item.amount
  })))

  Promise.all(tasks).then(products => {
    res.locals.products = products
    res.locals.totalPrice = products.reduce((sum, next) => sum + next.total, 0)
    res.locals.totalAmount = products.reduce((sum, next) => sum + next.amount, 0)
    res.render('cart', { title: '我的购物车' })
  })
}

// GET /cart/add?id=1&amount=1
exports.add = (req, res) => {
  let { id, amount = 1 } = req.query
  id = ~~id
  amount = ~~amount
  res.locals.amount = amount

  if (!id) throw createError(400, '必须提供商品 ID')

  Product.getProduct(id)
    .then(product => {
      res.locals.product = product

      // 获取已有的购物车列表
      const cart = req.cookies[config.cookie.cart_key] || []
      return cart
    })
    .then(cart => {
      // 将商品信息融入之前的购物车列表
      const exists = cart.find(c => c.id === id)

      if (exists) {
        // 之前已经存在于购物车中
        exists.amount += amount
      } else {
        // 之前购物车中没有
        cart.push({ id, amount })
      }

      const expires = new Date(Date.now() + config.site.cart_expires)
      res.cookie(config.cookie.cart_key, cart, { expires })
      res.render('cart-add', { title: '添加购物车成功' })
    })
}
