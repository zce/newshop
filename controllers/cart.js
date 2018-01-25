/**
 * Cart Controller
 */

exports.index = (req, res) => {
  res.render('cart', { title: '我的购物车' })
}

exports.add = (req, res) => {
  res.render('cart-add', { title: '添加购物车成功' })
}
