/**
 * Site Controller
 */

exports.index = (req, res) => {
  res.send('<h1>首页</h1>')
}

exports.list = (req, res) => {
  res.send('<h1>列表页</h1>')
}

exports.item = (req, res) => {
  res.send('<h1>详细页</h1>')
}
