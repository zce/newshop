/**
 * escape
 */

const qs = require('querystring')

module.exports = (input, opts) => {
  return qs.escape(input)
}
