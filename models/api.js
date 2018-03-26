/**
 * API 调用对象
 */

const axios = require('axios')

const config = require('../config')

module.exports = axios.create({
  baseURL: config.api.base,
  timeout: 3000,
  auth: {
    username: config.api.key,
    password: config.api.secret
  }
})

module.exports.interceptors.response.use(response => response, e => {
  e.name = e.response.data.error
  e.message = e.response.data.message
  return Promise.reject(e)
})

// module.exports.interceptors.response.use(response => {
//   const { config } = response
//   const { method, url, data } = config

//   // if (method === 'post' && url === 'http://newshop.me/api/v1/users/41/cart') {
//   //   console.log(`[${method}] ${url}`)
//   //   console.log('--------------------------------------------------')
//   //   console.log('→', data)
//   //   console.log('--------------------------------------------------')
//   //   console.log('←', response.data)
//   //   console.log('====================================================================================================')
//   // }

//   // console.log(`[${method}] ${url}`)
//   // console.log('--------------------------------------------------')
//   // console.log('→', JSON.stringify(params))
//   // console.log('--------------------------------------------------')
//   // console.log('←', JSON.stringify(data))
//   // console.log('====================================================================================================')

//   return response;
// }, e => Promise.reject(e));
