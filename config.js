module.exports = {
  database: {
    dialect: 'mysql',
    // host: '47.96.21.88',
    // username: 'tom',
    // password: 'jerry',
    // database: 'mydb',
    host: '127.0.0.1',
    username: 'root',
    password: 'wanglei',
    database: 'newshop',
    operatorsAliases: false,
    logging: false
  },
  mail: {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    name: '品优购',
    auth: { user: 'it@zce.me', pass: 'wtfijkthhxuvbjjg' },
    connectionTimeout: 1000,
    greetingTimeout: 1000,
    socketTimeout: 2000,
    debug: process.env.NODE_ENV === 'development'
  },
  image: {
    url: 'http://47.96.21.88:8888'
  }
}
