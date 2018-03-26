const captcha = require('svg-captcha')

exports.captcha = (req, res) => {
  const svg = captcha.create({
    size: 4,
    ignoreChars: '0o1ilOLI',
    noise: 3,
    color: true,
    background: '#fff'
  })
  // 生成验证码时将验证码的内容放到当前用户的 session 中
  req.session.captcha = svg.text.toLowerCase()

  // svg 的 mimetype image/svg+xml
  res.type('svg')
  res.send(svg.data)
}
