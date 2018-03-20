/**
 * 获取分类数据 helper
 */

const category = require('../models/category')

module.exports = (opts, done) => {
  category.findCascading().then(categories => {
    done(opts.fn({ categories }))
  })
}
