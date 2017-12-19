const { SafeString } = require('hbs')

const blocks = {}

module.exports = (key, opts) => {
  const block = blocks[key] = blocks[key] || []
  if (opts.fn) {
    // 此时是开闭标签
    block.push(opts.fn(opts.data.root))
  } else {
    // 单标签
    delete blocks[key]
    return new SafeString(block.join('\n'))
  }
}
