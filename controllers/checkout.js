/**
 * Checkout Controller
 */

const createError = require('http-errors')

const { Order, User } = require('../models')
const config = require('../config')
const { alipay } = require('../utils')

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
    .catch(e => next(createError(404)))
}

/**
 * GET /checkout/pay
 */
exports.pay = (req, res, next) => {
  const { n } = req.query

  Promise.resolve()
    .then(() => {
      if (!n) throw new Error('订单不存在')
      return Order.get(req.session.user.id, n)
    })
    .then(order => {
      const subject = `【${config.site.name}】购物`
      const body = order.products.map(i => i.name).join('\n')

      // 获取到订单需要支付的金额过后，直接调用 Alipay
      // 将支付信息通过 支付宝 SDK 转换成查询参数
      const params = alipay.pagePay({
        // subject + body 是为了让用户在支付宝的支付留下信息记录
        subject: subject,
        body: body,
        outTradeId: order.order_number,
        timeout: '10m',
        // 需要支付的金额
        amount: order.total_price,
        goodsType: '1',
        qrPayMode: 0
      })

      res.redirect(`${alipay.gateway}?${params}`)
    })
    .catch(e => next(createError(404)))
}
