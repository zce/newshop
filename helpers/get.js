const { Category } = require('../models')

module.exports = (type, opts, cb) => {
  switch (type) {
    case 'categories':
      Category.findCascading().then(categories => cb(opts.fn({ categories })))
      break
  }
}
