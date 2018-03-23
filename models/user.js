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
  return api.post('/users/register', { username, email, password })
    .then(res => res.data)
}
