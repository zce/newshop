/**
 * Checkout Controller
 */

const createError = require('http-errors')

const { Order } = require('../models')

/**
 * 结算部分商品
 *
 * GET /checkout
 *
 * query
 * - choose: 添加的商品ID
 */
exports.index = (req, res, next) => {
  if (!req.query.choose) throw createError(400)

  const products = (typeof req.query.choose === 'string' ? [req.query.choose] : req.query.choose).map(i => ~~i)
  Order.add(req.session.user.id, products)
    .then(order => {
      // 生成完订单过后跳转到这个订单的结算页
      res.redirect('/order?n=' + order.order_number)
    })
    .catch(e => next(createError(500, e)))
}
