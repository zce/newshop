module.exports = (a, b, context) => {
  // console.log(context.inverse)
  return a === b ? context.fn(context.data.root) : context.inverse(context.data.root)
}
