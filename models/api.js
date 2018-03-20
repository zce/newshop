/**
 * API 调用对象
 */

const axios = require('axios')

const config = require('../config')

const api = axios.create({
  baseURL: config.api.base,
  timeout: 3000,
  auth: {
    username: config.api.key,
    password: config.api.secret
  }
})

api.interceptors.request.use(config => {
  const { method, url, params } = config

  console.log(`[${method}] ${url}`)
  console.log(params)
  console.log('================================================================')

  return config;
}, error => Promise.reject(error));

module.exports = api
