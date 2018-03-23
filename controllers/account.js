/**
 * Account Controller
 */

exports.index = (req, res) => {
  res.redirect('login')
}

exports.login = (req, res) => {
  res.render('login', { title: '登录' })
}

exports.loginPost = (req, res) => {
  res.render('login', { title: '登录' })
}

exports.register = (req, res) => {
  res.render('register', { title: '注册' })
}

exports.registerPost = (req, res) => {
  res.render('register', { title: '注册' })
}
