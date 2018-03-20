/**
 * 商品模型对象（商品相关数据操作）
 */

const api = require('./api')

exports.findLikes = () => {
  return api.get('/products', { params: { type: 'like', limit: 6 } })
    .then(res => res.data)
    .catch(e => [])
}
