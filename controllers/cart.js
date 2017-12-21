const createError = require('http-errors')

const { Goods, UserCart } = require('../models')

exports.index = (req, res, next) => {
  Promise.resolve()
    .then(() => {
      if (req.session.currentUser) {
        return UserCart.findOne({ where: { user_id: req.session.currentUser.user_id } })
          .then(cart => JSON.parse(cart.cart_info))
      } else  {
        return req.cookies['cart_info'] || []
      }
    })
    .then(cartInfo => {
      res.locals.carts = cartInfo

      return Promise.all(cartInfo.map(c => {
        return Goods
          .findOne({ where: { goods_id: c.goods_id } })
          .then(goods => {
            c.goods = goods
            c.price = (goods.goods_price * c.amount).toFixed(2)
            return c.price
          })
      }))
    })
    .then(prices => {
      res.locals.totalPrice = prices.length && prices.reduce((a, b) => parseFloat(a) + parseFloat(b))
      res.locals.totalCount = prices.length
      res.render('cart/index', { title: '购物车' })
    })
    .catch(next)
}

exports.add = (req, res, next) => {
  if (isNaN(req.query.id)) return next(createError(400, '缺少必要参数'))

  Goods.findOne({ where: { goods_id: req.query.id } })
    .then(goods => {
      if (!goods) return next(createError(404, '没有这个商品'))

      res.locals.goods = goods

      if (!req.session.currentUser) {
        // 没有登录
        const cartInfo = req.cookies['cart_info'] || []

        const goodsInfo = cartInfo.find(c => c.goods_id === goods.goods_id)
        if (goodsInfo) {
          goodsInfo.amount ++
        } else {
          cartInfo.push({ goods_id: goods.goods_id, amount: 1 })
        }

        res.cookie('cart_info', cartInfo, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
        res.render('cart/add', { title: '加入购物车成功' })
      } else {
        // 已经登录
        UserCart.findOne({ where: { user_id: req.currentUser.user_id } })
          .then(cart => {
            const cartInfo = JSON.parse(cart.cart_info)

            const goodsInfo = cartInfo.find(c => c.goods_id === goods.goods_id)
            if (goodsInfo) {
              goodsInfo.amount ++
            } else {
              cartInfo.push({ goods_id: goods.goods_id, amount: 1 })
            }

            cart.cart_info = JSON.stringify(cartInfo)

            return cart.save()
          })
          .then(cart => {
            res.render('cart/add', { title: '加入购物车成功' })
          })
          .catch(next)
      }
    })
    .catch(next)
}
