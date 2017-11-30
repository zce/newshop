const createError = require('http-errors')
const { Category, Goods } = require('../models')

exports.index = (req, res) => {
  res.render('site/index', { title: '首页' })
}

exports.list = (req, res, next) => {
  if (isNaN(req.params.id)) return next(createError(404))

  // 获取 URL 中分类 ID
  const catId = parseInt(req.params.id)

  // 查询当前分类信息
  Category.findOne({ where: { cat_id: catId } })
    .then(category => {
      // 未找到分类 404
      if (!category) throw createError(404, '未找到对应分类')

      // 挂载分类信息到视图
      res.locals.category = category

      // 查询当前分类下的全部商品信息
      return Goods.findAll({ where: { cat_id: catId, is_del: false } })
    })
    .then(goods => {
      // 挂载商品信息到视图
      res.locals.goods = goods

      // 渲染页面
      res.render('site/list', { title: '列表页' })
    })
    .catch(next)
}

exports.item = (req, res) => {
  res.render('site/item', { title: '详细页', product: req.params.id })
}
