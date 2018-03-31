/**
 * 定制一个计算的 helper
 */

module.exports = (a, opt, b, opts) => {
  /* eslint no-eval: 0 */
  return eval(`${a} ${opt} ${b}`)
}
