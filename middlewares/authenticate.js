const debug = require('debug')('newshop:authenticate')

const { User } = require('../models')

module.exports = (req, res, next) => {
  // 判断 session 中是否有登录用户信息
  if (req.session.currentUser) {
    debug('already logged in')
    // 当前已经登录，直接继续
    return next()
  }

  // 判断是 cookie 否有自动登录信息
  if (req.cookies['last_logged_in_info']) {
    debug('check cookie info')
    // 尝试获取 cookie 中的登录信息
    const { uid, pwd } = req.cookies['last_logged_in_info']
    // 没有则跳转到登录
    if (!uid || !pwd) return res.redirect(`/account/login?redirect=${req.originalUrl}`)

    // 检测 cookie 中的登录信息的有效性
    User.findOne({ where: { user_id: uid, password: pwd } })
      .then(user => {
        if (user) {
          debug('check cookie success')
          // 有效
          req.session.currentUser = user
          return next()
        }

        debug('check cookie failed')
        // 无效则清空 cookie 并跳转到登录
        res.clearCookie('last_logged_in_info')
        res.redirect(`/account/login?redirect=${req.originalUrl}`)
      })
  } else {
    // 没有以上信息跳转登录
    res.redirect(`/account/login?redirect=${req.originalUrl}`)
  }
}
