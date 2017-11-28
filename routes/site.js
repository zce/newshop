const { Router } = require('express')
const router = new Router()

const siteController = require('../controllers/site')

router.get('/', siteController.index)
router.get('/list/:id', siteController.list)
router.get('/item/:id', siteController.item)

module.exports = router
