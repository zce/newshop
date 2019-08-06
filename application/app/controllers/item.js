/**
 * Item Controller
 */

const createError = require('http-errors')
const { Product, Category } = require('../models')

/**
 * 商品详细页
 *
 * GET /item/:id
 */
exports.index = (req, res, next) => {
  const id = ~~req.params.id
  if (!id) throw createError(400)

  // 查询商品详细信息
  Product.getProduct(id)
    .then(product => {
      res.locals.product = product
      res.locals.title = product.name
      // 额外数据
      return Promise.all([
        // 相关分类
        Category.getChildren(product.category.parent.id),
        // 推荐商品
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
