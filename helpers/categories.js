const { Category } = require('../models')

// 获取全部分类数据
module.exports = (context, callback) => {
  Category.findCascading()
    .then(categories => context.fn({ categories }))
    .then(callback)
}
