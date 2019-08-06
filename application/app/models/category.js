/**
 * 分类模型对象（分类相关数据操作）
 */

const api = require('./api')

/**
 * 获取全部分类数据
 * @return {Promise<Array>} 返回分类数据的 Promise
 * @todo 数据缓存
 */
exports.getCategories = () => {
  return api.get('/categories')
    .then(res => res.data)
    .catch(e => [])
}

/**
 * 获取层级结构的分类数据
 * @return {Promise<Object>} 返回分类数据的 Promise
 * @todo 数据缓存
 */
exports.getCascadingTree = () => {
  return exports.getCategories()
    .then(categories => {
      // 找到所有指定 pid 的分类 并为它们分别找到它们的子分类
      const findChildren = pid => categories
        .filter(s => s.pid === pid)
        .map(c => {
          c.children = findChildren(c.id)
          return c
        })

      return findChildren(0)
    })
}

/**
 * 获取指定分类信息
 * @param {Number} id 分类 ID
 * @return {Promise<Object>} 返回分类数据的 Promise
 */
exports.getCategory = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.get(`/categories/${id}?include=parent`)
    .then(res => res.data)
}

/**
 * 获取指定分类下的子分类
 * @param {Number} id 分类 ID
 * @return {Promise<Object>} 返回分类数据的 Promise
 */
exports.getChildren = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.get(`/categories/${id}/children`)
    .then(res => res.data)
    .catch(e => [])
}
