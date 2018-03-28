/**
 * 订单模型对象（订单相关数据操作）
 */

const api = require('./api')

/**
 * 获取全部订单
 * @param {Number} userId 用户 ID
 */
exports.getAll = (userId) => {
  if (!userId) throw new Error('Missing required parameter: userId.')

  return api.get(`/users/${userId}/order`)
    .then(res => res.data)
    .catch(e => [])
}

/**
 * 获取一个订单
 * @param {Number} userId 用户 ID
 * @param {Number} number 订单编号
 */
exports.get = (userId, number) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!number) throw new Error('Missing required parameter: number.')

  return api.get(`/users/${userId}/order/${number}`)
    .then(res => res.data)
}

/**
 * 创建一个订单
 * @param {Number} userId   用户 ID
 * @param {Array}  products 结算商品 ID 数组
 */
exports.add = (userId, products) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!products) throw new Error('Missing required parameter: products.')

  return api.post(`/users/${userId}/order`, { items: products.toString() })
    .then(res => res.data)
}

/**
 * 更新单个订单信息
 * @param {Number} userId   用户 ID
 * @param {String} orderNumber  订单编号
 * @param {Array}  order 更新后的订单信息
 */
exports.update = (userId, orderNumber, order) => {
  if (!userId) throw new Error('Missing required parameter: userId.')
  if (!orderNumber) throw new Error('Missing required parameter: orderNumber.')
  if (!order) throw new Error('Missing required parameter: order.')

  return api.patch(`/users/${userId}/order/${orderNumber}`, order)
    .then(res => res.data)
}
