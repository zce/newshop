/**
 * 用户模型对象（用户相关数据操作）
 */

const api = require('./api')

/**
 * 尝试使用用户名和密码进行登录，登录成功返回对应用户信息数据
 * @param {String} username 用户名
 * @param {String} password 密码
 */
exports.login = (username, password) => {
  if (!username) throw new Error('Missing required parameter: username.')
  if (!password) throw new Error('Missing required parameter: password.')

  return api.post('/users/login', { username, password })
    .then(res => res.data)
}

/**
 * 尝试使用用户名、邮箱和密码进行注册，登录成功返回新注册的用户信息数据
 * @param {String} username 用户名
 * @param {String} email    邮箱
 * @param {String} password 密码
 */
exports.register = (username, email, password) => {
  if (!username) throw new Error('Missing required parameter: username.')
  if (!email) throw new Error('Missing required parameter: email.')
  if (!password) throw new Error('Missing required parameter: password.')

  return api.post('/users/register', { username, email, password })
    .then(res => res.data)
}

/**
 * 根据 ID 删除用户
 * @param {Number} id 需要删除的用户 ID
 */
exports.delete = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.delete(`/users/${id}`)
    .then(res => undefined)
}
