/**
 * 手机号（数字）掩码
 * 13812345678 -> 138****5678
 */

module.exports = (input, opts) => {
  return input.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}
