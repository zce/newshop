exports.register = (req, res) => {
  res.render('account/register', { title: '品优购' })
}

exports.login = (req, res) => {
  res.render('account/login', { title: '品优购' })
}
