/**
 * Order Controller
 */

const createError = require('http-errors')

const { Order, User } = require('../models')

/**
 * 订单详细
 *
 * GET /order
 *
 * query
 * - n: 订单编号
 */
exports.index = (req, res, next) => {
  const { n } = req.query
  if (!n) throw createError(400)

  Promise.all([
    // 订单信息
    Order.get(req.session.user.id, n),
    // 用户收货地址
    User.getAllAddress(req.session.user.id)
  ])
    .then(([ order, addresses ]) => {
      res.locals.addresses = addresses
      res.locals.order = order
      res.render('order')
    })
    .catch(e => next(createError(500, e)))
}

/**
 * 修改订单收货地址
 *
 * GET /order/address
 *
 * query
 * - n: 订单编号
 * - address: 收货地址ID
 */
exports.address = (req, res, next) => {
  const { n, address } = req.query
  if (!(n && address)) throw createError(400)

  // 获取地址信息
  User.getAddress(req.session.user.id, address)
    .then(address => {
      const addr = `${address.name} ${address.address} ${address.phone} ${address.code}`
      // 更新订单收货地址
      return Order.update(req.session.user.id, n, { express_address: addr })
    })
    .then(order => {
      res.redirect(req.headers.referer)
    })
    .catch(e => next(createError(404)))
}
