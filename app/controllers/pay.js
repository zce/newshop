/**
 * Pay Controller
 */

const createError = require('http-errors')

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
  Order.get(n)
    .then(order => {
      if (order.user_id !== req.session.user.id) {
        // 当前订单不属于该用户
        throw createError(404)
      }
      res.redirect(alipay.pay(order))
    })
    .catch(next)
}

/**
 * 支付回调
 *
 * GET /pay/callback
 *
 * query
 * - total_amount: '93903.00',
 * - timestamp: '2018-03-29 17:47:02',
 * - sign: 'HCOQBpuQMamUQsL2VBX3oFSaaDM+gyei2ODjzL6fGD9mcXTctrIjLDIIIsOtjzqLNaSAdeXQEPas+HORqFngAnc5du0VrIPY6w7UlEEEJXNhcwpUoapK2YVQExXQoOw3UkvfRdT8t7ta3A1hjoTCwzf2PTjXuLhbrbvpNzYDZhBrLQFju2jYSNtX1e7lNz7u9GQ8NCt4LgFncwg00eNbON8yOmZWqPZc1n4fUm9JLG+P5e7C6Q+tJ9IFizAUSaPfIvdgd5C83wDx6lAjJATXduVl7Rvd2XOpYnAdhWMfJ2OSlY7vC5f7wgco6BEJUqwXdJuL/120wJYG3O+V+xe4fQ==',
 * - trade_no: '2018032921001004750200191323',
 * - sign_type: 'RSA2',
 * - auth_app_id: '2016081600257580',
 * - charset: 'utf-8',
 * - seller_id: '2088102171408138',
 * - method: 'alipay.trade.page.pay.return',
 * - app_id: '2016081600257580',
 * - out_trade_no: '152231670143460446',
 * - version: '1.0'
 */
exports.callback = (req, res, next) => {
  const number = req.query.out_trade_no
  Order.get(number)
    .then(order => {
      if (order.user_id !== req.session.user.id) {
        // 当前订单不属于该用户
        throw createError(404)
      }

      if (order.pay_status === '已付款') {
        return res.redirect(`/order?n=${number}`)
      }

      res.send('<style>h1 { margin: 50px 0; padding: 50px; border: 1px solid #e0e0e0; text-align: center; font-size: 3em; font-weight: normal; line-height: 1; color: #c81623;}</style><h1>我们还没有收到货款，请确认支付成功（可能是由于网络延时，请稍后再试）！</h1>')
    })
    .catch(e => next(createError(404)))
}

/**
 * 支付通知
 *
 * POST /pay/notify
 *
 * body
 * - gmt_create: '2018-03-30 10:51:24',
 * - charset: 'utf-8',
 * - gmt_payment: '2018-03-30 10:51:30',
 * - notify_time: '2018-03-30 10:51:31',
 * - subject: '【品优购】购物消费',
 * - sign: 'l26b7ff8+kxTUi9UeRDHr8qw+MpHvIjn3fSF1ioe/BvHHVsZ9hVXnMHSROIfeaaZ8MVPT6C4KxaI0oiVkTy26sOJ/82ipUYazCIaQBWH7jd5x3q4XLeEd9QnLZYjdBZAgquH56voKVVYl31kBAtqu70xzXBL0CzAb7djZi0KVjTBZDLnKkCqcgm+AIdQi23ZEkfK0i6gBLHwtWRVzrBXBPiVftH9t3IEaiwSHe8gidV7CDAHexEBMJM0h7KljiI+3r6xW8uKHEE4OmluNo92SnkI1EQcXAaSbxyV3CLmEV7yoWm2NMAvdApLUBwNSlucZ2srpsaXZ7+SVrMEnpjjYw==',
 * - buyer_id: '2088102173224752',
 * - body: '曼富图(MANFROTTO) MB BP-E轻便系列单反相机双肩背包摄影包\n迪比科遮光罩HB-45',
 * - invoice_amount: '380.00',
 * - version: '1.0',
 * - notify_id: '8076eccaf9715205b4e4d51000f39dalse',
 * - fund_bill_list: '[{"amount":"380.00","fundChannel":"ALIPAYACCOUNT"}]',
 * - notify_type: 'trade_status_sync',
 * - out_trade_no: '152237823031170164',
 * - total_amount: '380.00',
 * - trade_status: 'TRADE_SUCCESS',
 * - trade_no: '2018033021001004750200191185',
 * - auth_app_id: '2016081600257580',
 * - receipt_amount: '380.00',
 * - point_amount: '0.00',
 * - app_id: '2016081600257580',
 * - buyer_pay_amount: '380.00',
 * - sign_type: 'RSA2',
 * - seller_id: '2088102171408138'
 */
exports.notify = (req, res, next) => {
  if (!alipay.verify(req.body) || req.body.trade_status !== 'TRADE_SUCCESS') {
    throw createError(400)
  }

  Order.update(req.body.out_trade_no, {
    pay_status: '已付款',
    trade_no: req.body.trade_no
  })
    .then(order => {
      if (order.pay_status === '已付款') {
        res.send('success')
      } else {
        res.send('fail')
      }
    })
    .catch(e => res.send('fail'))
}
