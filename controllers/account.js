/**
 * Account Controller
 */

const { User } = require('../models')

exports.index = (req, res) => {
  res.redirect('login')
}

exports.login = (req, res) => {
  res.render('login', { title: '登录' })
}

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

      if (!req.session.captcha || captcha.toLowerCase() !== sessionCaptcha) {
        throw new Error('请正确填写验证码')
      }

      res.render('login', { title: '登录' })
    })
    .catch(e => {
      res.locals.message = e.message
      res.render('login', { title: '登录' })
    })
}

exports.register = (req, res) => {
  res.render('register', { title: '注册' })
}

exports.registerPost = (req, res) => {
  // 处理表单接收逻辑
  const { username, email, password, confirm, agree } = req.body

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

    })
    .catch(e => {
      req.locals.message = e.message
      res.render('register', { title: '注册' })
    })
}
