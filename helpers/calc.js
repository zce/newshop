/**
 * 定制一个计算的 helper
 */

module.exports = (a, opt, b, opts) => {
  return eval(`${a} ${opt} ${b}`);
}
