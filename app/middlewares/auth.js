/**
 * 这个中间件只在部分路由时工作
 * 对当前访问者进行登录状态的校验
 * 目标：正常登录用户 next 其余的 跳转到登录页
 */

const qs = require('querystring')

const config = require('../config')
const { User } = require('../models')

/**
 * 从 session 或者 cookie 中找到当前登录用户信息
 * 不一定能找到，一定不会导致页面跳转到登录页
 */
exports.resolve = (req, res, next) => {
  // 先判断当前用户是否登录
  // 1. 判断 session 中有没有 user
  if (req.session.user) {
    return next()
  }

  // 2. 判断 cookie 中有没有记住我的信息
  if (!req.cookies[config.cookie.remember_key]) {
    // session 和 cookie 都没有找到
    return next()
  }

  // 如果有 尝试使用 记住我的信息去自动登录
  const { uid, pwd } = req.cookies[config.cookie.remember_key]

  Promise.resolve()
    .then(() => {
      if (!(uid && pwd)) throw new Error('Cookie 格式不正确')

      // 通过 uid 查询出对应的用户对象
      return User.get(uid)
    })
    .then(user => {
      // user => 有这个用户 or 不存在
      if (!user) throw new Error('用户不存在')

      // 有则判断密码（都是加密过后的所以直接对比）
      // 判断 用户的 密码是否与记住我中的一致
      if (user.password !== pwd) throw new Error('密码错误')

      // 密码也 OK 可以登录 将当前用户信息再次存入 session
      req.session.user = user

      // 通过 cookie 登录成功
      next()
    })
    .catch(e => {
      // 记住我的信息登录失败
      res.clearCookie(config.cookie.remember_key)
      next()
    })
}

/**
 * 根据当前是否登录决定是否跳转到登录页
 */
exports.required = (req, res, next) => {
  if (req.session.user) {
    // 已有登录用户信息
    return next()
  }
  // 由于登录页登录完成过后需要调回当前正在访问的页面
  // 所以必须在这里将当前访问地址传递给 登录页
  // 一定是未登录
  return res.redirect('/account/login?redirect=' + qs.escape(req.url))
}
