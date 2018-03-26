module.exports = {
  site: {
    name: '品优购',
    url: 'http://localhost:2080',
    per_page: 10
  },
  api: {
    base: 'http://newshop.me/api/v1',
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
