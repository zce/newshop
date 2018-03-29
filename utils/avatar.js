/**
 * 头像操作
 */

const fs = require('fs')
const path = require('path')
const util = require('util')

const copyFile = util.promisify(fs.copyFile)
const rename = util.promisify(fs.rename)

exports.generate = id => {
  const defaultAvatar = path.join(__dirname, 'default-avatar.png')
  const userAvatar = path.join(__dirname, `../public/uploads/avatar-${id}.png`)

  return copyFile(defaultAvatar, userAvatar)
}

exports.update = (file, id) => {
  if (!file) return Promise.resolve()

  // 头像的目标位置
  const target = path.join(__dirname, `../public/uploads/avatar-${id}.png`)

  return rename(file, target)
}
