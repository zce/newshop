/**
 * 发送邮件
 */

const fs = require('fs')
const path = require('path')
const hbs = require('express-hbs')
const nodemailer = require('nodemailer')

const config = require('../config')

const transporter = nodemailer.createTransport(config.mail)

const render = (name, context) => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, 'templates', name + '.hbs'), 'utf8', (err, content) => {
    if (err) return reject(err)

    const result = hbs.handlebars.compile(content)(context)
    resolve(result)
  })
});

exports.sendActiveEmail = user => {
  return render('active', { user, config })
    .then(html => {
      return transporter.sendMail({
        from: `"${config.mail.name}" <${config.mail.auth.user}>`,
        to: `"${user.username}" <${user.email}>`,
        subject: `【${config.site.name}】激活用户邮箱`,
        html: html
      })
    })
}
