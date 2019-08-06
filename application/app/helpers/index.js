const equal = require('./equal')
const calc = require('./calc')
const escape = require('./escape')
const mask = require('./mask')
const format = require('./format')
const pagination = require('./pagination')

const category = require('./category')

exports.sync = { equal, calc, escape, mask, format, pagination }

exports.async = { category }
