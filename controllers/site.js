/**
 * Site Controller
 */

exports.index = (req, res) => {
  res.render('index')
}

exports.list = (req, res) => {
  res.render('list', { title: '[分类名]' })
}

exports.item = (req, res) => {
  res.render('item', { title: '[商品名] &laquo; [分类名]' })
}
