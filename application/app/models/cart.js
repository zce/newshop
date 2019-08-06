/**
 * 购物车模型对象（购物车相关数据操作）
 */

const api = require('./api')

/**
 * 获取用户购物车记录
 * @param {Number} userId 用户 ID
 */
exports.get = (userId) => {
  if (!userId) throw new Error('Missing required parameter: userId.')

  return api.get(`/users/${userId}/cart`)
    .then(res => res.data)
}

/**
 * 添加商品到购物车
 * @param {Number} userId 用户 ID
 * @param {Number} productId 商品 ID
 * @param {Number} amount 数量
 */
exports.add = (userId, productId, amount = 1) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!productId) throw new Error('Missing required parameter: productId.')

  return api.post(`/users/${userId}/cart`, { id: productId, amount })
    .then(res => res.data)
}

/**
 * 更新购物车商品数量
 * @param {Number} userId 用户 ID
 * @param {Number} productId 商品 ID
 * @param {Number} amount 数量
 */
exports.update = (userId, productId, amount) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!productId) throw new Error('Missing required parameter: productId.')
  if (!amount) throw new Error('Missing required parameter: amount.')

  return api.patch(`/users/${userId}/cart/${productId}`, { amount })
    .then(res => res.data)
}

/**
 * 删除购物车商品
 * @param {Number} userId 用户 ID
 * @param {Number} productId 商品 ID
 */
exports.delete = (userId, productId) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!productId) throw new Error('Missing required parameter: productId.')

  return api.delete(`/users/${userId}/cart/${productId}`)
    .then(res => res.data)
}
