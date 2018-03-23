/**
 * List Controller
 */

const createError = require('http-errors')

const { Category, Product } = require('../models')

exports.index = (req, res, next) => {
  const id = ~~req.params.id
  if (!id) throw createError(400, 'Bad Request')

  // 处理参数
  const perPage = 10
  const page = ~~req.query.page || 1
  // commend quantity market_time price -price
  const sort = req.query.sort || 'commend'

  res.locals.perPage = perPage
  res.locals.page = page
  res.locals.sort = sort

  // 查询数据
  Category.getCategory(id)
    .then(category => {
      res.locals.title = category.name
      res.locals.category = category
      return Product.getProducts(id, page, perPage, sort)
    })
    .then(({ products, totalPages }) => {
      res.locals.products = products
      res.locals.totalPages = totalPages
      res.render('list')
    })
    .catch(e => next(createError(404, e)))
}
