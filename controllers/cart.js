/**
 * Cart Controller
 */

const createError = require('http-errors')

const { Cart, Product } = require('../models')
const config = require('../config')

/**
 * GET /cart
 */
exports.index = (req, res) => {
  // 购物车数据提取到公共中间件中获取（公用）
  res.render('cart', { title: '我的购物车' })
}

/**
 * GET /cart/add?id=1&amount=1
 */
exports.add = (req, res) => {
  const id = ~~req.query.id
  const amount = ~~req.query.amount || 1

  if (!id) throw createError(400, '必须提供商品 ID')

  res.locals.amount = amount

  // 在线购物车
  if (req.session.user) {
    return Cart.add(req.session.user.id, id, amount)
      .then(cart => {
        res.locals.product = cart.find(c => c.id === id)
        res.render('cart-add', { title: '添加购物车成功' })
      })
      .catch(e => {
        throw new Error('商品不存在')
      })
  }

  // 离线购物车
  Product.getProduct(id)
    .then(product => {
      res.locals.product = product
      return req.cookies[config.cookie.cart_key] || []
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

      const expires = new Date(Date.now() + config.cookie.cart_expires)
      res.cookie(config.cookie.cart_key, cart, { expires })
      res.render('cart-add', { title: '添加购物车成功' })
    })
    .catch(e => {
      throw new Error('商品不存在')
    })
}
