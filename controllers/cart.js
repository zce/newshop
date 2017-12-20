const createError = require('http-errors')

const { Goods, UserCart } = require('../models')

exports.index = (req, res, next) => {

}

exports.add = (req, res, next) => {
  if (isNaN(req.query.id)) return next(createError(400, '缺少必要参数'))

  Goods.findOne({ where: { goods_id: req.query.id } })
    .then(goods => {
      if (!goods) return next(createError(404, '没有这个商品'))

      res.locals.goods = goods

      const cartInfo = req.cookies['cart_info'] || []
      cartInfo.push({ goods_id: goods.goods_id })
      res.cookie('cart_info', cartInfo, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })

      res.render('cart/add')
    })
    .catch(next)
}
