const path = require('path')
const Alipay = require('alipay-node-sdk')

const alipay_gate_way = 'https://openapi.alipay.com/gateway.do'
const alipay_gate_way_sandbox = 'https://openapi.alipaydev.com/gateway.do'

// 支付客户端
const alipay = new Alipay({
  appId: '2016081600257580',
  // 支付成功过后 支付宝的通知地址
  notifyUrl: 'http://localhost:2080/checkout/callback',
  // 应用私钥
  rsaPrivate: path.join(__dirname, 'secrets/app_private_key.pem'),
  // 支付宝公钥
  rsaPublic: path.join(__dirname, 'secrets/alipay_public_key.pem'),
  // 是否是沙箱模式
  sandbox: true,
  signType: 'RSA2'
})

alipay.gateway = alipay_gate_way_sandbox

module.exports = alipay
