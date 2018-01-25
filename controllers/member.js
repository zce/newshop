/**
 * Member Controller
 */

exports.index = (req, res) => {
  res.send('<h1>会员中心页</h1>')
}

exports.profile = (req, res) => {
  res.send('<h1>个人资料页</h1>')
}

exports.address = (req, res) => {
  res.send('<h1>收货地址页</h1>')
}

exports.order = (req, res) => {
  res.send('<h1>个人订单页</h1>')
}
