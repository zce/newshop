/**
 * 定制一个判断是否相等的 helper
 */

module.exports = function (a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this)
}
