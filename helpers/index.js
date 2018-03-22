const equal = require('./equal')
const mask = require('./mask')
const format = require('./format')
const pagination = require('./pagination')

const category = require('./category')

exports.sync = { equal, mask, format, pagination }

exports.async = { category }
