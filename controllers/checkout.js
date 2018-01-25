/**
 * Checkout Controller
 */

exports.index = (req, res) => {
  res.render('checkout', { title: '结算' })
}

exports.pay = (req, res) => {
  res.render('checkout-pay', { title: '支付' })
}
