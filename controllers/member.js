/**
 * Member Controller
 */

exports.index = (req, res) => {
  res.render('member', { title: '会员中心' })
}

exports.profile = (req, res) => {
  res.render('member-profile', { title: '我的个人资料' })
}

exports.address = (req, res) => {
  res.render('member-address', { title: '我的收货地址' })
}

exports.order = (req, res) => {
  res.render('member-order', { title: '我的订单' })
}
