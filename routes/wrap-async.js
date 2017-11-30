module.exports = action => {
  return (req, res, next) => {
    action(req, res).then(() => {}, next)
  }
}
