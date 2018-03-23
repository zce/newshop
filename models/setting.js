/**
 * 设置模型对象（设置相关数据操作）
 */

const api = require('./api')

/**
 * 获取全部设置数据
 * @return {Promise<Object>} 返回设置信息的 Promise
 */
exports.getSettings = () => {
  return api.get('/settings')
    .then(res => res.data)
    .catch(e => ({}))
}

/**
 * 获取单个设置数据
 * @param  {String} key   设置键
 * @return {Promise<Any>} 返回设置信息的 Promise
 */
exports.getSetting = key => {
  return api.get(`/settings/${key}`)
    .then(res => res.data)
    .catch(e => null)
}
