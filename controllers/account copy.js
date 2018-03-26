/**
 * 账号控制器
 */

const uuid = require('uuid')
const bcrypt = require('bcryptjs')

const { User, UserCart } = require('../models')
const utils = require('../utils')
const carts = require('../middlewares/carts')

/**
 * 将 cookie 中的购物车信息合并到数据库中（如果有的话）
 */
function syncCart (req) {
  // 1. 读取 cookie 购物车的信息
  const cookieCartList = req.cookies.cart_list || []
  if (!cookieCartList.length) {
    // 没有离线购物车信息，直接结束该业务
    return false
  }

  // 2. 合并到数据库中已有的购物车信息
  UserCart.findOrCreate({
    where: { user_id: req.session.currentUser.user_id },
    defaults: {
      user_id: req.session.currentUser.user_id,
      cart_info: '[]',
      created_at: Date.now() / 1000,
      updated_at: Date.now() / 1000
    }
  })
  .then(([ cart, created ]) => {
    let dbCartList
    try {
      dbCartList = JSON.parse(cart.cart_info)
    } catch (e) {
      dbCartList = []
    }

    // cookieCartList => dbCartList
    cookieCartList.forEach(c => {
      // c 在数据库是否存在
      const exists = dbCartList.find(d => d.id === c.id)
      if (exists) {
        exists.amount += c.amount
      } else {
        dbCartList.push(c)
      }
    })

    // dbCartList => 合并过后的结果
    cart.cart_info = JSON.stringify(dbCartList)

    // 3. 将合并的结果再次存回数据库
    return cart.save()
  })
  // TODO: 4. 重新获取购物车数据（包括价格名称。。）
}

// GET /account/login
exports.login = (req, res) => {
  // 将跳转带过来的参数放到表单的 action 上
  // 让下一次 post 请求也可取到
  res.locals.redirect = req.query.redirect

  res.render('login')
}

// POST /account/login
exports.loginPost = (req, res) => {
  const { username, password, captcha, remember } = req.body

  res.locals.username = username
  res.locals.redirect = req.query.redirect

  // 1. 校验
  if (!(username && password && captcha)) {
    return res.render('login', { msg: '请完整填写登录信息' })
  }

  const sessionCaptcha = req.session.captcha

  // 删除之前的验证码
  delete req.session.captcha

  if (!sessionCaptcha || captcha.toLowerCase() !== sessionCaptcha.toLowerCase()) {
    return res.render('login', { msg: '验证码不正确' })
  }

  // ------------------------------------------------
  // let where = { username: username }

  // if (username.includes('@')) {
  //   // 邮箱登录
  //   where = { user_email: username }
  // }

  // let currentUser

  // // 2. 持久化
  // User.findOne({ where })
  // ------------------------------------------------

  const whereProp = username.includes('@') ? 'user_email' : 'username'

  let currentUser

  // 2. 持久化
  User.findOne({ where: { [whereProp]: username } })
    .then(user => {
      if (!user) throw new Error('用户名或密码错误')

      currentUser = user

      // 判断密码是否匹配
      return bcrypt.compare(password, user.password)
    })
    .then(match => {
      if (!match) throw new Error('用户名或密码错误')

      // 用户名存在而且密码匹配 将当前登录用户信息存放到 session 中
      req.session.currentUser = currentUser

      // 处理记住我
      if (remember) {
        // redirect + set cookie 把用户名和密码的密文存下来，下次自动登录
        // cookie 的名称最好无任何意义
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        // 可以使用可逆加密存储信息
        // 这个 cookie 一定是设置为 httpOnly （只能在请求响应的时候由服务端设置，不能在客户端由JS设置）
        res.cookie('last_logged_in_user', { uid: currentUser.user_id, pwd: currentUser.password }, { expires: expires, httpOnly: true })
      }

      // 同步购物车
      return syncCart(req)
    })
    .then(() => {
      res.clearCookie('cart_list')
      delete req.cookies.cart_list
      // 再次同步界面上的购物车信息
      carts(req, res, () => {
        // 3. 响应
        res.redirect(req.query.redirect || '/member')
      })
    })
    .catch(e => {
      // 如果出现异常再次显示登录页并展示错误消息
      res.render('login', { msg: e.message })
    })
}

// GET /account/register
exports.register = (req, res) => {
  res.render('register')
}

// POST /account/register
exports.registerPost = (req, res) => {
  // 处理表单接收逻辑
  const { username, email, password, confirm, agree } = req.body

  // 保持提交过来的数据
  res.locals.username = username
  res.locals.email = email

  // 1. 合法化校验（先挑简单的来）
  if (!(username && email && password && confirm)) {
    // 有没填写的内容
    return res.render('register', { msg: '必须完整填写表单' })
  }

  if (password !== confirm) {
    return res.render('register', { msg: '密码必须一致' })
  }

  if (!agree) {
    return res.render('register', { msg: '必须同意注册协议' })
  }

  // 判断用户名是否存在
  User.findOne({ where: { username } })
    .then(user => {
      if (user) throw new Error('用户名已经存在')
      // 判断邮箱是否存在
      return User.findOne({ where: { user_email: email } })
    })
    .then(user => {
      if (user) throw new Error('邮箱已经存在')

      // 可以注册
      // 2. 持久化
      const newUser = new User()
      newUser.username = username
      newUser.user_email = email
      // 提前给用户准备一个只属于他的激活码
      newUser.user_email_code = uuid().substr(0, 12)
      const salt = bcrypt.genSaltSync(10)
      newUser.password = bcrypt.hashSync(password, salt)
      newUser.create_time = Date.now() / 1000
      newUser.update_time = Date.now() / 1000
      return newUser.save()
    })
    .then(user => {
      // user => 新建过后的用户信息（包含ID和那些默认值）
      if (!(user && user.user_id)) throw new Error('注册失败')
      // 发送激活邮箱邮件
      const activeLink = `http://localhost:3000/account/active?code=${user.user_email_code}`

      utils.sendEmail(email, '品优购邮箱激活', `<p><a href="${activeLink}">${activeLink}</a></p>`)
        .then(() => res.redirect('/account/login'))
    })
    .catch(e => {
      res.render('register', { msg: e.message })
    })
}

// GET /account/logout
exports.logout = (req, res) => {
  delete req.session.currentUser
  res.clearCookie('last_logged_in_user')
  res.redirect('/account/login')
}

// GET /account/active
exports.active = (req, res, next) => {
  const { code } = req.query

  if (!code) {
    const err = new Error('Not Found')
    err.status = 404
    return next(err)
  }

  User.findOne({ where: { user_email_code: code } })
    .then(user => {
      // 已经取到当前这个验证码匹配的用户，当前登录的用户信息在 Session 中
      // 判断是否为同一个用户
      if (user.user_id !== req.session.currentUser.user_id) {
        // 404
        const err = new Error('Not Found')
        err.status = 404
        return next(err)
      }

      // 邮箱就是当前登录用户的
      user.is_active = '是'
      // 已经激活成功了，没必要再保存 code
      user.user_email_code = ''

      // 再次保存当前用户信息（更新数据）
      // save 内部自动判断是否有ID 从而决定更新还是新加
      return user.save()
    })
    .then(user => {
      res.redirect('/member')
    })
}

/**
 * 邮箱验证
 * 1. 用户填写邮箱表单
 * 2. 网站接受邮箱，并向这个邮箱发送一个唯一的链接地址
 * 3. 如果用户可以点击这个链接，及证明邮箱是存在但是不能证明邮箱是属于当前注册用户的
 * 4. 在这激活链接被请求时，网站应该要去用户登录，并且根据用户的登录信息与验证码查询出来的用户信息对比
 */
