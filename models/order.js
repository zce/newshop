/**
 * 订单模型对象（订单相关数据操作）
 */

const api = require('./api')

/**
 * 创建一个订单
 * @param {Number} userId 用户 ID
 * @param {Number} number 订单编号
 */
exports.get = (userId, number) => {
  return api.get(`/users/${userId}/order/${number}`)
    .then(res => res.data)
}

/**
 * 创建一个订单
 * @param {Number} userId   用户 ID
 * @param {Array}  products 结算商品 ID 数组
 */
exports.add = (userId, products) => {
  return api.post(`/users/${userId}/order`, { id: products.toString() })
    .then(res => res.data)
}
