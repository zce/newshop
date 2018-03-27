/**
 * Checkout Controller
 */

const { Order } = require('../models')

exports.index = (req, res) => {
  const { n } = req.query
  Order.get(req.session.user.id, n)
    .then(order => {
      res.locals.order = order
      res.render('checkout')
    })
}

exports.create = (req, res) => {
  const products = (typeof req.query.choose === 'string' ? [req.query.choose] : req.query.choose).map(i => ~~i)
  Order.add(req.session.user.id, products)
    .then(order => {
      // 生成完订单过后跳转到这个订单的结算页
      res.redirect('/checkout?n=' + order.order_number)
    })
}

exports.pay = (req, res) => {
  res.send(req.query)
}
