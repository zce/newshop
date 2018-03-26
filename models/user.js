/**
 * 用户模型对象（用户相关数据操作）
 */

const nodemailer = require('nodemailer')

const api = require('./api')

const config = require('../config')

const transporter = nodemailer.createTransport(config.mail)

/**
 * 尝试使用用户名和密码进行登录，登录成功返回对应用户信息数据
 * @param {String} username 用户名
 * @param {String} password 密码
 */
exports.login = (username, password) => {
  return api.post('/users/login', { username, password })
    .then(res => res.data)
}

/**
 * 尝试使用用户名、邮箱和密码进行注册，登录成功返回新注册的用户信息数据
 * @param {String} username 用户名
 * @param {String} email    邮箱
 * @param {String} password 密码
 */
exports.register = (username, email, password) => {
  let user = null

  return api.post('/users/register', { username, email, password })
    .then(res => {
      user = res.data

      const activeLink = `${config.site.url}/account/active?v=${user.email_verify}`
      // 发送激活邮箱邮件
      return transporter.sendMail({
        // 收件人或者发件人的格式可以是：`"名字" <邮箱地址>`
        from: `"${config.mail.name}" <${config.mail.auth.user}>`,
        to: `"${user.username}" <${user.email}>`,
        subject: `【${config.site.name}】激活用户邮箱`,
        html: `<p><a href="${activeLink}">${activeLink}</a></p>`
      })
    })
    .then(() => user)
}
