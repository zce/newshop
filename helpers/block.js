const { SafeString } = require('hbs')

const blocks = {}

module.exports = (key, context) => {
  const block = blocks[key] = blocks[key] || []
  if (context.fn) {
    // 此时是开闭标签
    block.push(context.fn(context.data.root))
  } else {
    // 单标签
    delete blocks[key]
    return new SafeString(block.join('\n'))
  }
}
