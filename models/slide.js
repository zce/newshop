/**
 * 轮播模型对象（轮播相关数据操作）
 */

const api = require('./api')

exports.find = () => {
  return api.get('/slides')
    .then(res => res.data)
    .catch(e => [])
}
