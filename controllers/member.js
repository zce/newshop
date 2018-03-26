/**
 * Member Controller
 */

// GET /member
exports.index = (req, res) => {
  res.render('member-index', { title: '会员中心' })
}

// GET /member/order
exports.order = (req, res) => {
  res.send('order')
}

// GET /member/profile
exports.profile = (req, res) => {
  res.send('profile')
}

// GET /member/address
exports.address = (req, res) => {
  res.send('address')
}
