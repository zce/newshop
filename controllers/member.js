exports.index = (req, res) => {
  res.render('member/index', { title: '我的账户' })
}

exports.order = (req, res) => {
  res.render('member/order', { title: '我的订单' })
}

exports.profile = (req, res) => {
  res.render('member/profile', { title: '我的个人资料' })
}

exports.address = (req, res) => {
  res.render('member/address', { title: '我的地址簿' })
}
