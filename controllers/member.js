const path = require('path')
const fs = require('mz/fs')
const _ = require('lodash')
const createError = require('http-errors')
const multer = require('multer')
const { User, Consignee } = require('../models')
const upload = multer()

/**
 * 会员中心首页
 */
exports.index = (req, res) => {
  res.render('member/index', { title: '我的账户' })
}

/**
 * 订单列表
 */
exports.order = (req, res) => {
  res.render('member/order', { title: '我的订单' })
}

/**
 * 个人资料维护
 */
exports.profile = (req, res) => {
  res.render('member/profile', { title: '我的个人资料' })
}

exports.profilePost = [upload.single('avatar'), (req, res, next) => {
  // 保存文件
  const avatarPath = `/avatar/${req.session.currentUser.user_id}.png`
  Promise.resolve()
    .then(() => {
      if (!req.file) return
      return fs.writeFile(path.join(__dirname, `../public${avatarPath}`), req.file.buffer)
    })
    .then(() => {
      return User.findOne({ where: { user_id: req.session.currentUser.user_id } })
    })
    .then(user => {
      const userInfo = _.pick(req.body, ['user_sex', 'user_qq', 'user_tel', 'user_xueli', 'user_hobby', 'user_introduce'])
      Object.assign(user, userInfo)
      return user.save()
    })
    .then(user => {
      req.session.currentUser = user
      res.locals.currentUser = user
      res.render('member/profile', { title: '我的个人资料' })
    })
    .catch(next)
}]

/**
 * 地址管理
 */
exports.address = (req, res, next) => {
  Consignee.findAll({ where: { user_id: req.session.currentUser.user_id } })
    .then(records => {
      res.locals.addresses = records
      res.render('member/address', { title: '我的地址簿' })
    })
    .catch(next)
}

exports.addressPost = (req, res, next) => {
  const data = _.pick(req.body, ['cgn_name', 'cgn_address', 'cgn_tel', 'cgn_code'])
  data.user_id = req.session.currentUser.user_id
  Consignee.create(data)
    .then(() => {
      return Consignee.findAll({ where: { user_id: req.session.currentUser.user_id } })
    })
    .then(records => {
      res.locals.addresses = records
      res.render('member/address', { title: '我的地址簿' })
    })
    .catch(next)
}

/**
 * 用户激活
 */
exports.active = (req, res, next) => {
  const { code } = req.query
  User.find({ where: { user_email_code: code } })
    .then(user => {
      if (!user) return next(createError(404))
      if (user.user_id !== req.session.currentUser.user_id) {
        return next(createError(404))
      }
      // 既合法又匹配当前登录用户
      user.is_active = '是'
      return user.save()
    })
    .then(user => {
      req.session.currentUser = user
      res.redirect('/member')
    })
}
