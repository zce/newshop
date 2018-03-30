/**
 * 错误处理
 */

const Youch = require('youch')

const middlewares = []

// 处理 404 请求，转发到错误处理器
middlewares.push((req, res, next) => {
  next()
  const err = new Error('Not Found')
  err.status = 404
  throw err
})

// 错误处理器
middlewares.push((err, req, res, next) => {
  if (req.app.get('env') === 'development') {
    return new Youch(err, req).toHTML().then(html => res.send(html))
  }

  res.locals.status = err.status || 500
  res.locals.message = err.message
  res.status(res.locals.status).render('error')
})

// 导出模块
module.exports = middlewares
