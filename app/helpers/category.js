/**
 * 获取分类数据 helper
 */

const Category = require('../models/category')

module.exports = (opts, done) => {
  Category.getCascadingTree().then(categories => {
    done(opts.fn({ categories }))
  })
}
