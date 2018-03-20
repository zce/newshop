/**
 * 分类模型对象（分类相关数据操作）
 */

const api = require('./api')

exports.findCascading = () => {
  return api.get('/categories')
    .then(res => {
      // 找到所有指定 pid 的分类 并为它们分别找到它们的子分类
      const findChildren = pid => res.data
        .filter(s => s.pid === pid)
        .map(c => {
          c.children = findChildren(c.id)
          return c
        })

      return findChildren(0)
    })
    .catch(e => [])
}
