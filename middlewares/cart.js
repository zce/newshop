/**
 * 获取全部购物车信息
 */
const debug = require('debug')('newshop:middlewares:cart')
const { Goods, UserCart } = require('../models')

module.exports = (req, res, next) => {
  debug('try to resolve cart info')
  Promise.resolve()
    .then(() => {
      if (req.session.currentUser) {
        debug('resolve cart info from database')
        return UserCart.findOne({ where: { user_id: req.session.currentUser.user_id } })
          .then(cart => cart && cart.cart_info ? JSON.parse(cart.cart_info) : [])
      } else {
        debug('resolve cart info from cookie')
        return req.cookies['cart_info'] || []
      }
    })
    .then(cartInfo => {
      res.locals.carts = cartInfo

      return Promise.all(cartInfo.map(c => {
        return Goods
          .findOne({ where: { goods_id: c.goods_id } })
          .then(goods => {
            c.goods = goods
            c.price = (goods.goods_price * c.amount).toFixed(2)
            return c.price
          })
      }))
    })
    .then(prices => {
      res.locals.totalPrice = prices.length && prices.reduce((a, b) => parseFloat(a) + parseFloat(b))
      res.locals.totalCount = prices.length

      debug('cart info resolved')
      next()
    })
    .catch(next)
}
