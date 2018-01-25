/**
 * Checkout Controller
 */

exports.index = (req, res) => {
  res.send('<h1>结算页</h1>')
}

exports.pay = (req, res) => {
  res.send('<h1>结算支付页</h1>')
}
