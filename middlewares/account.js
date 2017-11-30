const debug = require('debug')('newshop:middlewares:account')
const { User } = require('../models')

exports.resolve = (req, res, next) => {
  // 判断 session 中是否有登录用户信息
  debug('try to resolve current user from session')
  if (req.session.currentUser) {
    debug('resolved current user from session')
    res.locals.currentUser = req.session.currentUser
    return next()
  }
  debug('resolve current user from session failed')

  // 判断是 cookie 否有自动登录信息
  if (!req.cookies['last_logged_in_info']) {
    return next()
  }

  debug('try to resolve current user from cookie info')
  // 尝试获取 cookie 中的登录信息
  const { uid, pwd } = req.cookies['last_logged_in_info']
  if (!uid || !pwd) {
    debug('resolve current user from cookie info failed')
    return next()
  }

  // 检测 cookie 中的登录信息的有效性
  User.findOne({ where: { user_id: uid, password: pwd } })
    .then(user => {
      if (!user) {
        // 无效则清空 cookie
        debug('resolve current user from cookie info failed')
        res.clearCookie('last_logged_in_info')
        return next()
      }

      // 有效
      debug('resolved current user from cookie info')
      req.session.currentUser = user
      res.locals.currentUser = user
      next()
    })
    .catch(() => next())
}

exports.required = (req, res, next) => {
  // 根据是否有登录用户信息决定是否跳转到登录页
  if (req.session.currentUser) return next()
  res.redirect(`/account/login?redirect=${req.originalUrl}`)
}
