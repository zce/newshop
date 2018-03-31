/**
 * Account Controller
 */

const createError = require('http-errors')

const config = require('../config')
const { mail, avatar } = require('../utils')
const { User, Cart } = require('../models')

/**
 * 默认页面
 *
 * GET /account
 */
exports.index = (req, res, next) => {
  res.redirect('login')
}

/**
 * 登录页
 *
 * GET /account/login
 *
 * query
 * - redirect: 跳转地址
 */
exports.login = (req, res, next) => {
  if (req.session.user) {
    // 已经登录了，没必要继续
    return res.redirect(req.query.redirect || '/')
  }
  res.render('login', { title: '登录' })
}

/**
 * 登录表单提交
 *
 * POST /account/login
 *
 * query
 * - redirect: 跳转地址
 *
 * body
 * - username: 用户名
 * - password: 密码
 * - captcha: 验证码
 * - remember: 记住我
 */
exports.loginPost = (req, res, next) => {
  if (req.session.user) {
    // 已经登录了，没必要继续
    return res.redirect(req.query.redirect || '/')
  }

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

      return User.login(username, password).catch(e => { throw new Error('用户名或密码错误') })
    })
    .then(user => {
      req.session.user = user

      // 处理记住我
      if (remember) {
        // redirect + set cookie 把用户名和密码的密文存下来，下次自动登录
        // cookie 的名称最好无任何意义
        const expires = new Date(Date.now() + config.cookie.remember_expires)
        // 可以使用可逆加密存储信息
        // 这个 cookie 一定是设置为 httpOnly（只能在请求响应的时候由服务端设置，不能在客户端由 JavaScript 设置）
        res.cookie(config.cookie.remember_key, { uid: user.id, pwd: user.password }, { expires: expires, httpOnly: true })
      }

      // 同步离线购物车
      const cart = req.cookies[config.cookie.cart_key]
      if (!cart) return

      // 需要同步购物车信息
      // 由于服务端有并发修改数据问题，所以必须使用串行结构任务
      return Promise.all(cart.map(item => Cart.add(user.id, item.id, item.amount)))

      // // 在服务端解决并发问题后建议使用并行结构
      // return cart.reduce((promise, item) => promise.then(() => Cart.add(user.id, item.id, item.amount)), Promise.resolve())
    })
    .then(() => {
      res.clearCookie(config.cookie.cart_key)
      res.redirect(req.query.redirect || '/')
    })
    .catch(e => {
      res.locals.message = e.message
      res.render('login', { title: '登录' })
    })
}

/**
 * 注册页
 *
 * GET /account/register
 *
 * query
 * - redirect: 跳转地址
 */
exports.register = (req, res, next) => {
  if (req.session.user) {
    // 已经登录了，没必要继续
    return res.redirect(req.query.redirect || '/')
  }
  res.render('register', { title: '注册' })
}

/**
 * 注册表单提交
 *
 * POST /account/register
 *
 * query
 * - redirect: 跳转地址
 *
 * body
 * - username: 用户名
 * - email: 邮箱
 * - password: 密码
 * - confirm: 确认密码
 * - agree: 同意协议
 */
exports.registerPost = (req, res, next) => {
  if (req.session.user) {
    // 已经登录了，没必要继续
    return res.redirect(req.query.redirect || '/')
  }

  // 处理表单接收逻辑
  const { username, email, password, confirm, agree } = req.body

  let userId = 0
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
      return mail.sendActiveEmail(user).catch(e => { throw new Error('发送激活邮件失败') })
    })
    .then(() => {
      // 生成默认头像
      return avatar.generate(userId)
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

/**
 * 退出登录
 *
 * GET /account/logout
 */
exports.logout = (req, res, next) => {
  delete req.session.user
  res.clearCookie(config.cookie.remember_key)
  res.redirect('/account/login')
}

/**
 * 激活用户邮箱
 *
 * GET /account/active
 *
 * query
 * - v: 验证码
 */
exports.active = (req, res, next) => {
  const { v } = req.query

  if (!v) throw createError(400)

  // 已经取到当前这个验证码匹配的用户，当前登录的用户信息在 Session 中
  // 判断是否为同一个用户
  if (req.session.user.email_verify !== v) throw createError(400)

  User.active(req.session.user.id)
    .then(user => {
      req.session.user = user
      res.redirect('/member')
    })
    .catch(e => next(createError(500, '激活失败，请重试')))
}
