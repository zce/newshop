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

      if (!req.session.captcha || captcha.toLowerCase() !== sessionCaptcha) {
        throw new Error('请正确填写验证码')
      }

      res.render('login', { title: '登录' })
    })
    .catch(e => {
      res.locals.message = e.message
      res.render('login', { title: '登录' })
    })
}

exports.register = (req, res) => {
  res.render('register', { title: '注册' })
}

exports.registerPost = (req, res) => {
  res.render('register', { title: '注册' })
}
