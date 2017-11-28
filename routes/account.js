const { Router } = require('express')
const router = new Router()

router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
