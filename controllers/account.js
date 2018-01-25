/**
 * Account Controller
 */

exports.login = (req, res) => {
  res.render('login', { title: '登录' })
}

exports.register = (req, res) => {
  res.render('register', { title: '注册' })
}
