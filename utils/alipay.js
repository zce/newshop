/**
 * 支付宝
 * https://github.com/fym201/alipay-node-sdk#alipay-node-sdk
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

exports.pay = order => {
  const subject = `【${config.site.name}】购物消费`
  const body = order.products.map(i => i.name).join('\n')

  // 获取到订单需要支付的金额过后，直接调用 Alipay
  // 将支付信息通过 支付宝 SDK 转换成查询参数
  const params = alipay.pagePay({
    // subject + body 是为了让用户在支付宝的支付留下信息记录
    subject: subject,
    body: body,
    outTradeId: order.order_number,
    timeout: '20m',
    // 需要支付的金额
    amount: order.total_price,
    goodsType: 1,
    qrPayMode: 2,
    return_url: `${config.site.url}/pay/callback`
  })

  return `${alipay.gateway}?${params}`
}
