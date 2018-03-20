/**
 * 定制一个判断是否相等的 helper
 */

module.exports = (a, b, opts) => {
  return a === b ? opts.fn(opts.data.root) : opts.inverse(opts.data.root)
}
