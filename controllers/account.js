const uuid = require('uuid')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

exports.index = (req, res) => {
  res.redirect('/account/login')
}

/**
 * 注册页面
 */
exports.register = (req, res) => {
  res.render('account/register', { layout: null })
}

/**
 * 注册表单提交处理
 */
exports.registerPost = (req, res) => {
  // 获取请求体参数
  const { username, email, password, confirm, agree } = req.body
  Promise.resolve()
    .then(() => {
      // 参数校验
      if (!(username && email && password && confirm)) {
        throw new Error('请完整填写注册表单')
      }
      if (!validator.isEmail(email)) {
        throw new Error('请确认邮箱格式是否正确')
      }
      if (password !== confirm) {
        throw new Error('请确保两次输入密码一致')
      }
      if (agree !== 'on') {
        throw new Error('必须同意注册协议')
      }
      return User.findOne({ where: { username } })
    })
    .then(res => {
      if (res) throw new Error('用户名已存在')
      return User.findOne({ where: { user_email: email } })
    })
    .then(res => {
      if (res) throw new Error('邮箱已存在')
      // 密码加密
      return bcrypt.hash(password, 8)
    })
    .then(pwd => {
      // 用户名与邮箱正常 可以注册
      return User.create({
        username: username,
        password: pwd,
        user_email: email,
        user_email_code: uuid().substr(0, 8),
        create_time: Date.now() / 1000,
        update_time: Date.now() / 1000
      })
    })
    .then(user => {
      if (!user) throw new Error('注册失败，请稍后再试')
      // 注册成功跳转到登录页面
      res.redirect('/account/login')
    })
    .catch(err => {
      res.locals.message = err.message
      res.locals.raw = req.body
      res.render('account/register', { layout: null })
    })
}

exports.login = (req, res) => {
  res.render('account/login', { layout: null })
}

exports.loginPost = (req, res) => {
  const { username, password, remember } = req.body
  Promise.resolve()
    .then(() => {
      if (!username || !password) {
        throw new Error('请完整填写登录表单')
      }
      // 根据用户名找到对应用户信息
      return User.findOne({ where: { username } })
    })
    .then(user => {
      // 用户不存在
      if (!user) throw new Error('用户名与密码不匹配')
      // 对比密码
      return [bcrypt.compare(password, user.password), user]
    })
    .then(([match, user]) => {
      // 密码错误
      if (!match) throw new Error('用户名与密码不匹配')

      // 处理记住登录状态
      if (remember === 'on') {
        // 将用户 ID 与加密过后的密码存入用户的 Cookie 中
        res.cookie('last_logged_in_info', { uid: user.user_id, pwd: user.password }, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
      }

      // 将用户信息存入 Session
      req.session.currentUser = user
      res.redirect(req.query.redirect || '/member')
    })
    .catch(err => {
      res.locals.message = err.message
      res.locals.raw = req.body
      res.render('account/login', { layout: null })
    })
}

exports.logout = (req, res) => {
  delete req.session.currentUser
  res.clearCookie('last_logged_in_info')
  res.redirect('/account/login')
}
