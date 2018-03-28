/**
 * Member Controller
 */

const fs = require('fs')
const path = require('path')
const util = require('util')
const multer = require('multer')
const createError = require('http-errors')

const { User, Order } = require('../models')

const uploader = multer({ dest: path.join(__dirname, '../public/uploads/') })

const rename = util.promisify(fs.rename)

/**
 * GET /member
 */
exports.index = (req, res) => {
  res.render('member-index', { title: '会员中心' })
}

/**
 * GET /member/order
 */
exports.order = (req, res) => {
  Order.getAll(req.session.user.id)
    .then(orders => {
      res.locals.orders = orders
      res.render('member-order', { title: '我的订单' })
    })
}

/**
 * GET /member/profile
 */
exports.profile = (req, res) => {
  res.render('member-profile', { title: '我的个人资料' })
}

/**
 * POST /member/profile
 * 如果表单的类型不是 urlencoded 格式 body-parser 解析不到数据
 * 可以使用 multer 中间件完成
 */
exports.profilePost = [uploader.single('avatar'), (req, res) => {
  // 头像的目标位置
  const target = path.join(__dirname, `../public/uploads/avatar-${req.session.user.id}.png`)

  Promise.resolve()
    .then(() => {
      if (!req.file) return
      return rename(req.file.path, target)
    })
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
 * GET /member/address
 */
exports.address = (req, res) => {
  User.getAddress(req.session.user.id)
    .then(addresses => {
      res.locals.addresses = addresses
      res.render('member-address', { title: '我的收货地址' })
    })
}

/**
 * POST /member/address
 */
exports.addressPost = (req, res) => {
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
      res.render('member-address', { title: '我的收货地址' })
    })
}

/**
 * DELETE /member/address/delete
 */
exports.addressDelete = (req, res) => {
  const id = ~~req.query.id
  if (!id) throw createError(400, '必须提供正确的地址 ID')
  User.deleteAddress(req.session.user.id, id)
    .then(() => {
      res.redirect(req.headers.referer)
    })
}
