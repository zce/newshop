/**
 * Search Controller
 */

const createError = require('http-errors')

const { Category, Product } = require('../models')
const config = require('../config')

exports.index = (req, res, next) => {
  const { q } = req.query
  if (!q) throw createError(400, 'Bad Request')

  res.locals.q = q

  // 处理参数
  const perPage = config.site.per_page
  const page = ~~req.query.page || 1
  // commend quantity market_time price -price
  const sort = req.query.sort || 'commend'

  res.locals.perPage = perPage
  res.locals.page = page
  res.locals.sort = sort

  // 查询数据
  Product.searchProducts(q, page, perPage, sort)
    .then(({ products, totalPages }) => {
      res.locals.products = products
      res.locals.totalPages = totalPages
      res.render('list')
    })
}
