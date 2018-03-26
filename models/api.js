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
//   const { config, data } = response
//   const { method, url, params } = config

//   console.log(`[${method}] ${url}`)
//   console.log('--------------------------------------------------')
//   console.log('→', JSON.stringify(params))
//   console.log('--------------------------------------------------')
//   console.log('←', JSON.stringify(data))
//   console.log('====================================================================================================')

//   return response;
// }, e => Promise.reject(e));
