module.exports = (a, b, opts) => {
  // console.log(opts.inverse)
  return a === b ? opts.fn(opts.data.root) : opts.inverse(opts.data.root)
}
