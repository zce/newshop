module.exports = (img, context) => {
  return img.startsWith('http') ? img : context.data.root.config.image.url + img
}
