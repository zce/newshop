const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const { User, UserCart } = require('../models')
const mailer = require('../utils/mailer')

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
      const activeLink = `${req.protocol}://${req.get('host')}/member/active?code=${user.user_email_code}`
      const html = `<p>请点击以下超链接，激活账号</p><a href="${activeLink}">${activeLink}</a>`
      return mailer.send('品优购账号激活', html, user.user_email)
    })
    .then(result => {
      // 注册成功跳转到登录页面
      res.redirect('/account/login')
    })
    .catch(err => {
      console.log(err)
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

      // 同步购物车信息
      if (req.cookies['cart_info']) {
        return UserCart.findOrBuild({
          where: { user_id: user.user_id },
          defaults: {
            user_id: user.user_id,
            cart_info: '[]',
            created_at: Date.now() / 1000,
            updated_at: Date.now() / 1000
          }
        })
      }
    })
    .then(carts => {
      if (carts && carts[0]) {
        const cookieCartInfo = req.cookies['cart_info']
        const dbCartInfo = JSON.parse(carts[0].cart_info)
        cookieCartInfo.forEach(c => {
          const exists = dbCartInfo.find(d => d.goods_id === c.goods_id)
          if (exists) {
            exists.amount += c.amount
          } else {
            dbCartInfo.push(c)
          }
        })
        carts[0].cart_info = JSON.stringify(dbCartInfo)
        console.log(carts[0])

        return carts[0].save()
      }
    })
    .then(cart => {
      if (cart) {
        delete req.cookies['cart_info']
        res.clearCookie('cart_info')
      }

      res.redirect(req.query.redirect || '/member')
    })
    .catch(err => {
      console.error(err)
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
