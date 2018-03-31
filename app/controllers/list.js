/**
 * List Controller
 */

const createError = require('http-errors')

const config = require('../config')
const { Category, Product } = require('../models')

/**
 * 列表页
 *
 * GET /list/:id
 *
 * query
 * - page: 页码
 * - sort: 排序
 */
exports.index = (req, res, next) => {
  const id = ~~req.params.id
  if (!id) throw createError(400)

  // 处理参数
  const perPage = config.site.per_page
  const page = ~~req.query.page || 1
  // 支持：commend quantity market_time price -price
  const sort = req.query.sort || 'commend'

  res.locals.perPage = perPage
  res.locals.page = page
  res.locals.sort = sort

  // 调用接口查询分类数据
  Category.getCategory(id)
    .then(category => {
      // 页面标题
      res.locals.title = category.name
      // 挂载分类数据
      res.locals.category = category
      // 调用接口查询商品列表数据
      return Product.getProducts(id, page, perPage, sort)
    })
    .then(({ products, totalPages }) => {
      // 挂载产品列表数据
      res.locals.products = products
      res.locals.totalPages = totalPages
      res.render('list')
    })
    .catch(e => next(createError(404, e)))
}

/**
 * 搜索页
 *
 * GET /search
 *
 * query
 * - q: 搜索字段
 * - page: 页码
 * - sort: 排序
 */
exports.search = (req, res, next) => {
  const { q } = req.query
  if (!q) throw createError(400)

  res.locals.q = q

  // 处理参数
  const perPage = config.site.per_page
  const page = ~~req.query.page || 1
  // 支持：commend quantity market_time price -price
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
    .catch(e => next(createError(500, e)))
}
