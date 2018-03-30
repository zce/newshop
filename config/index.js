module.exports = {
  site: {
    name: '品优购',
    url: 'https://ns.uieee.com',
    per_page: 10
  },
  api: {
    base: 'https://ns-api.uieee.com/api/v1',
    key: 'newshop-frontend',
    secret: 'd8667837fce5a0270a35f4a8fa14be479fadc774'
  },
  mail: {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    name: '品优购',
    auth: { user: 'it@zce.me', pass: 'wtfijkthhxuvbjjg' },
    // connectionTimeout: 1000,
    // greetingTimeout: 1000,
    // socketTimeout: 2000,
    debug: process.env.NODE_ENV === 'development'
  },
  alipay: {
    app_id: '2016081600257580'
  },
  session: {
    secret: 'MAKE IT BETTER!'
  },
  cookie: {
    remember_key: 'last_logged_in_user',
    remember_expires: 7 * 24 * 60 * 60 * 1000,
    cart_key: 'shopping_cart',
    cart_expires: 30 * 24 * 60 * 60 * 1000
  }
}

if (process.env.NODE_ENV === 'development') {
  module.exports.site.url = 'http://localhost:3080'
  module.exports.api.base = 'http://localhost:8000/v1'
}
