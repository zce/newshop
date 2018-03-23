/**
 * 商品模型对象（商品相关数据操作）
 */

const api = require('./api')

/**
 * 获取猜你喜欢的商品
 * @param {Number} catgory 分类 ID
 * @param {Number} length 数量
 * @return {Promise<Array>} 返回商品数据的 Promise
 */
exports.getLikeProducts = (category = 0, length = 6) => {
  if (typeof length !== 'number') throw Error(`Expected a number, got ${typeof length}.`)

  return api.get(`/products?type=like&limit=${length}&filter=cat:${category}`)
    .then(res => res.data)
    .catch(e => [])
}

/**
 * 根据分类 ID 分页获取商品数据
 * @param  {Number} catId   分类 ID
 * @param  {Number} page    页码
 * @param  {Number} perPage 页大小
 * @param  {String} sort    排序规则
 * @return {Promise<Array>} 返回商品数据的 Promise
 */
exports.getProducts = (catId, page, perPage, sort) => {
  if (!catId) throw new Error('Missing required parameter: catId.')

  return api.get(`/products?page=${page}&per_page=${perPage}&sort=${sort}&filter=cat:${catId}`)
    .then(res => ({ products: res.data, totalPages: ~~res.headers['x-total-pages'] }))
    .catch(e => ({ products: [], totalPages: 0 }))
}

/**
 * 获取单个商品信息
 * @param  {Number} id      商品 ID
 * @return {Promise<Array>} 返回商品数据的 Promise
 */
exports.getProduct = id => {
  if (!id) throw new Error('Missing required parameter: id.')

  return api.get(`/products/${id}?include=introduce,category,pictures`)
    .then(res => res.data)
}
