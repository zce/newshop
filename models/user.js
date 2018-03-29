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
 * 根据 ID 获取用户信息
 * @param {Number} id 用户 ID
 */
exports.get = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.get(`/users/${id}`)
    .then(res => res.data)
}

/**
 * 根据 ID 更新用户
 * @param {Number} id   需要更新的用户 ID
 * @param {Object} user 更新后的用户数据
 */
exports.update = (id, user) => {
  if (!id) throw new Error('Missing required parameter: id.')
  if (!user) throw new Error('Missing required parameter: user.')

  return api.patch(`/users/${id}`, user)
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

/**
 * 根据 ID 激活用户
 * @param {Number} id 需要激活的用户 ID
 */
exports.active = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.post(`/users/${id}/active`)
    .then(res => res.data)
}

/**
 * 根据 ID 取消激活用户
 * @param {Number} id 需要激活的用户 ID
 */
exports.unactive = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.put(`/users/${id}/unactive`)
    .then(res => res.data)
}

/**
 * 获取用户的地址列表
 * @param {Number} id 用户ID
 */
exports.getAllAddress = id => {
  return api.get(`/users/${id}/address`)
    .then(res => res.data)
    .catch(e => [])
}

/**
 * 获取单个用户的地址信息
 * @param {Number} id 用户ID
 * @param {Number} address 地址ID
 */
exports.getAddress = (id, address) => {
  return api.get(`/users/${id}/address/${address}`)
    .then(res => res.data)
}

/**
 * 添加一个用户的收货地址
 * @param {Number} id 用户ID
 * @param {Object} address 添加的地址对象
 */
exports.addAddress = (id, address) => {
  return api.post(`/users/${id}/address`, address)
    .then(res => res.data)
}

/**
 * 删除用户的地址
 * @param {Number} id 用户ID
 * @param {Number} addressId 地址ID
 */
exports.deleteAddress = (id, addressId) => {
  return api.delete(`/users/${id}/address/${addressId}`)
    .then(res => undefined)
}
