/**
 * 格式化小数单位
 */

module.exports = (input, opts) => {
  return parseFloat(input).toFixed(opts.hash.length || 2)
}
