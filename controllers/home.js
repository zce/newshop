/**
 * Home Controller
 */

const slide = require('../models/slide')
const product = require('../models/product')

exports.index = (req, res) => {
  slide.find()
    .then(slides => {
      res.locals.slides = slides

      return product.findLikes()
    })
    .then(likes => {
      res.locals.likes = likes

      res.render('index')
    })
}
