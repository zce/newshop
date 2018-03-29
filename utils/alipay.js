/**
 * 支付宝
 */

const path = require('path')
const Alipay = require('alipay-node-sdk')
const config = require('../config')

// 支付客户端
const alipay = new Alipay({
  appId: config.alipay.app_id,
  // 支付成功过后 支付宝的通知地址
  notifyUrl: `${config.site.url}/pay/notify`,
  // 应用私钥
  rsaPrivate: path.join(__dirname, 'secrets/app_private_key.pem'),
  // 支付宝公钥
  rsaPublic: path.join(__dirname, 'secrets/alipay_public_key.pem'),
  // 是否是沙箱模式
  sandbox: true,
  // 签名类型
  signType: 'RSA2'
})

// 'https://openapi.alipay.com/gateway.do'
alipay.gateway = 'https://openapi.alipaydev.com/gateway.do'

module.exports = alipay
