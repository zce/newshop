/**
 * Checkout Controller
 */

const createError = require('http-errors')
const { Order, User } = require('../models')

/**
 * GET /checkout
 */
exports.index = (req, res) => {
  const { n } = req.query
  Promise.all([
    Order.get(req.session.user.id, n),
    User.getAllAddress(req.session.user.id)
  ])
  .then(([ order, addresses ]) => {
    res.locals.addresses = addresses
    res.locals.order = order
    res.render('checkout')
  })
}

/**
 * GET /checkout/create
 */
exports.create = (req, res) => {
  const products = (typeof req.query.choose === 'string' ? [req.query.choose] : req.query.choose).map(i => ~~i)
  Order.add(req.session.user.id, products)
    .then(order => {
      // 生成完订单过后跳转到这个订单的结算页
      res.redirect('/checkout?n=' + order.order_number)
    })
}

/**
 * GET /checkout/address
 */
exports.address = (req, res, next) => {
  const { n, address } = req.query
  if (!(n && address)) {
    throw createError(400)
  }

  User.getAddress(req.session.user.id, address)
    .then(address => {
      const addr = `${address.name} ${address.address} ${address.phone} ${address.code}`
      return Order.update(req.session.user.id, n, { express_address: addr })
    })
    .then(order => {
      res.redirect(req.headers.referer);
    })
    .catch(e => console.log(e) || next(createError(404)))
}

/**
 * GET /checkout/pay
 */
exports.pay = (req, res) => {
  res.send(req.query)
}
