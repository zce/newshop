const { Goods } = require('../models')

exports.index = (req, res) => {
  res.render('site/index', { title: '首页' })
}

exports.list = async (req, res) => {
  res.locals.goods = await Goods.findAll({ where: { cat_id: req.params.id } })
  res.render('site/list', { title: '列表页', category: req.params.id })
}

exports.item = (req, res) => {
  res.render('site/item', { title: '详细页', product: req.params.id })
}
