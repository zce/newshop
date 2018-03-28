/**
 * Item Controller
 */

const createError = require('http-errors')
const { Product, Category } = require('../models')

/**
 * GET /item/:id
 */
exports.index = (req, res, next) => {
  const id = ~~req.params.id
  if (!id) throw createError(400, 'Bad Request')

  Product.getProduct(id)
    .then(product => {
      res.locals.product = product
      res.locals.title = product.name
      // 相关分类数据
      return Promise.all([
        Category.getChildren(product.category.parent.id),
        Product.getLikeProducts(product.category.parent.id, 5)
      ])
    })
    .then(([ children, products ]) => {
      res.locals.relatedCategory = children
      res.locals.relatedProducts = products
      res.render('item')
    })
    .catch(e => next(createError(404, e)))
}
