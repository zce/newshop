/**
 * Cart Controller
 */

const createError = require('http-errors')

const config = require('../config')
const { Cart, Product } = require('../models')

/**
 * 购物车
 *
 * GET /cart
 */
exports.index = (req, res, next) => {
  // 购物车数据提取到公共中间件中获取（公用）
  // 这里没有必要再次获取数据
  res.render('cart', { title: '我的购物车' })
}

/**
 * 添加购物车
 *
 * GET /cart/add?id=1&amount=1
 */
exports.add = (req, res, next) => {
  const id = ~~req.query.id
  const amount = ~~req.query.amount || 1

  if (!id) throw createError(400)

  res.locals.amount = amount

  // 在线购物车
  if (req.session.user) {
    return Cart.add(req.session.user.id, id, amount)
      .then(cart => {
        // 重新挂载购物车数据！！！
        res.locals.cart = {
          products: cart,
          totalPrice: cart.reduce((sum, next) => sum + parseFloat(next.total), 0),
          totalAmount: cart.reduce((sum, next) => sum + parseInt(next.amount), 0)
        }
        // 当前添加的商品信息
        res.locals.product = cart.find(c => c.id === id)
        res.render('cart-add', { title: '添加购物车成功' })
      })
      .catch(e => next(createError(404, e)))
  }

  // 离线购物车
  Product.getProduct(id)
    .then(product => {
      // 当前添加的商品信息
      res.locals.product = product
      // 获取当前购物车列表
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

      // 保存购物车信息到Cookie
      const expires = new Date(Date.now() + config.cookie.cart_expires)
      res.cookie(config.cookie.cart_key, cart, { expires })

      // 重新获取并挂载购物车数据！！！
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

      res.render('cart-add', { title: '添加购物车成功' })
    })
    .catch(e => next(createError(404, e)))
}
