/**
 * Account Controller
 */

const { User } = require('../models')
const { mail } = require('../utils')

// GET /account
exports.index = (req, res) => {
  res.redirect('login')
}

// GET /account/login
exports.login = (req, res) => {
  res.render('login', { title: '登录' })
}

// POST /account/login
exports.loginPost = (req, res) => {
  const { username, password, captcha, remember } = req.body

  Promise.resolve()
    .then(() => {
      // 1. 校验
      if (!(username && password && captcha)) {
        throw new Error('请完整填写登录信息')
      }

      const sessionCaptcha = req.session.captcha

      // 删除之前的验证码!!!
      delete req.session.captcha

      if (!sessionCaptcha || captcha.toLowerCase() !== sessionCaptcha) {
        throw new Error('请正确填写验证码')
      }

      return User.login(username, password)
        .catch(e => {
          throw new Error('用户名或密码错误')
        })
    })
    .then(user => {
      req.session.user = user
      res.redirect(req.query.redirect || '/')
    })
    .catch(e => {
      res.locals.message = e.message
      res.render('login', { title: '登录' })
    })
}

// GET /account/logout
exports.logout = (req, res) => {
  delete req.session.currentUser
  res.clearCookie('last_logged_in_user')
  res.redirect('/account/login')
}

// GET /account/register
exports.register = (req, res) => {
  res.render('register', { title: '注册' })
}

// POST /account/register
exports.registerPost = (req, res) => {
  // 处理表单接收逻辑
  const { username, email, password, confirm, agree } = req.body

  let userId = 0;
  Promise.resolve()
    .then(() => {
      // 1. 合法化校验（先挑简单的来）
      if (!(username && email && password && confirm)) {
        throw new Error('必须完整填写表单')
      }

      if (password !== confirm) {
        throw new Error('密码必须一致')
      }

      if (!agree) {
        throw new Error('必须同意注册协议')
      }

      // 2. 业务校验（由于注册业务中包括业务校验，所以省略）
      // 3. 注册业务
      return User.register(username, email, password)
    })
    .then(user => {
      // user => 新建过后的用户信息（包含ID和那些默认值）
      if (!(user && user.id)) throw new Error('注册失败')

      userId = user.id
      // 发送激活邮件
      return mail.sendActiveEmail(user)
    })
    .then(() => {
      res.locals.flash = '注册成功！请查收邮件激活您的邮箱！'
      res.render('register', { title: '注册成功' })
    })
    .catch(e => {
      // 注册失败删除用户
      userId && User.delete(userId)
      res.locals.message = e.message
      res.render('register', { title: '注册' })
    })
}

exports.active = (req, res) => {

}
