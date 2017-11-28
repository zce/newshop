const { Router } = require('express')
const router = new Router()

router.get('/', (req, res, next) => {
  res.send('respond with cart page')
})

module.exports = router
