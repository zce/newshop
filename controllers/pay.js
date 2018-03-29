/**
 * Pay Controller
 */

const createError = require('http-errors')

const config = require('../config')
const { alipay } = require('../utils')
const { Order } = require('../models')

/**
 * 支付
 *
 * GET /pay
 *
 * query
 * - n: 订单编号
 */
exports.index = (req, res, next) => {
  const { n } = req.query
  if (!n) throw createError(400)

  // 获取订单信息
  Order.get(req.session.user.id, n)
    .then(order => {
      const subject = `【${config.site.name}】购物消费`
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
