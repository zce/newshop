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
  Order.get(req.session.user.id, n)
    .then(order => {
      res.redirect(alipay.pay(order))
    })
    .catch(e => next(createError(404)))
}

exports.callback = (req, res, next) => {
  /*
  { total_amount: '93903.00',
  timestamp: '2018-03-29 17:47:02',
  sign: 'HCOQBpuQMamUQsL2VBX3oFSaaDM+gyei2ODjzL6fGD9mcXTctrIjLDIIIsOtjzqLNaSAdeXQEPas+HORqFngAnc5du0VrIPY6w7UlEEEJXNhcwpUoapK2YVQExXQoOw3UkvfRdT8t7ta3A1hjoTCwzf2PTjXuLhbrbvpNzYDZhBrLQFju2jYSNtX1e7lNz7u9GQ8NCt4LgFncwg00eNbON8yOmZWqPZc1n4fUm9JLG+P5e7C6Q+tJ9IFizAUSaPfIvdgd5C83wDx6lAjJATXduVl7Rvd2XOpYnAdhWMfJ2OSlY7vC5f7wgco6BEJUqwXdJuL/120wJYG3O+V+xe4fQ==',
  trade_no: '2018032921001004750200191323',
  sign_type: 'RSA2',
  auth_app_id: '2016081600257580',
  charset: 'utf-8',
  seller_id: '2088102171408138',
  method: 'alipay.trade.page.pay.return',
  app_id: '2016081600257580',
  out_trade_no: '152231670143460446',
  version: '1.0' }
  */
  const number = req.query.out_trade_no
  Order.get(req.session.user.id, number)
    .then(order => {
      if (order.pay_status === '已付款') {
        return res.redirect(`/order?n=${number}`)
      }
      res.send('我们还没有收到货款，请确认支付成功（可能是由于网络延时，请稍后再试）')
    })
    .catch(e => next(createError(404)))
}

exports.notify = (req, res, next) => {
  console.log('========================== notify ==========================')
  console.log(req.method)
  console.log(req.query)
  console.log(req.body)
  res.send('')
}
