const equal = require('./equal')
const escape = require('./escape')
const mask = require('./mask')
const format = require('./format')
const pagination = require('./pagination')

const category = require('./category')

exports.sync = { equal, escape, mask, format, pagination }

exports.async = { category }
