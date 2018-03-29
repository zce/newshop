/**
 * Member Controller
 */

const path = require('path')

const multer = require('multer')
const createError = require('http-errors')

const { avatar } = require('../utils')
const { User, Order } = require('../models')

const uploader = multer({ dest: path.join(__dirname, '../public/uploads/') })

/**
 * 会员中心
 *
 * GET /member
 */
exports.index = (req, res, next) => {
  res.render('member', { title: '会员中心' })
}

/**
 * 我的订单
 *
 * GET /member/order
 */
exports.order = (req, res, next) => {
  Order.getAll(req.session.user.id)
    .then(orders => {
      res.locals.orders = orders
      res.render('member-order', { title: '我的订单' })
    })
}

/**
 * 我的个人资料
 *
 * GET /member/profile
 */
exports.profile = (req, res, next) => {
  res.render('member-profile', { title: '我的个人资料' })
}

/**
 * 修改个人资料表单提交
 *
 * POST /member/profile
 *
 * 如果表单的类型不是 urlencoded 格式 body-parser 解析不到数据
 * 可以使用 multer 中间件完成
 */
exports.profilePost = [uploader.single('avatar'), (req, res, next) => {
  avatar.update(req.file.path, req.session.user.id)
    .then(() => {
      // 移动头像成功，修改数据
      return User.update(req.session.user.id, req.body)
    })
    .then(user => {
      // 由于 session 中的数据还是上一个版本所以同步一下
      Object.assign(req.session.user, user)

      res.render('member-profile', { title: '我的个人资料' })
    })
    .catch(e => {
      res.locals.message = '更新失败，请稍后重试'
      res.render('member-profile', { title: '我的个人资料' })
    })
}]

/**
 * 我的收货地址
 *
 * GET /member/address
 */
exports.address = (req, res, next) => {
  User.getAllAddress(req.session.user.id)
    .then(addresses => {
      res.locals.addresses = addresses
      res.render('member-address', { title: '我的收货地址' })
    })
    .catch(e => {
      res.locals.addresses = []
      res.render('member-address', { title: '我的收货地址' })
    })
}

/**
 * 添加收货地址表单提交
 *
 * POST /member/address
 *
 * body
 * - name: 收货人姓名
 * - address: 收货地址
 * - phone: 收货人手机
 * - code: 收货人邮编
 */
exports.addressPost = (req, res, next) => {
  const { name, address, phone, code } = req.body

  Promise.resolve()
    .then(() => {
      if (!(name && address && phone && code)) throw new Error('必须完整填写表单信息')
      return User.addAddress(req.session.user.id, { name, address, phone, code })
    })
    .then(() => {
      res.redirect(req.headers.referer)
    })
    .catch(e => {
      res.locals.message = e.message
      res.render('member-address', { title: '我的收货地址' })
    })
}

/**
 * 删除单条收货地址
 *
 * GET /member/address/delete
 *
 * query
 * - id: 删除的地址ID
 */
exports.addressDelete = (req, res, next) => {
  const id = ~~req.query.id
  if (!id) throw createError(400)

  User.deleteAddress(req.session.user.id, id)
    .then(() => res.redirect(req.headers.referer))
    .catch(e => next(createError(500, e)))
}
