const { Router } = require('express')
const router = new Router()

const accountController = require('../controllers/account')

router.get('/', accountController.index)
router.get('/login', accountController.login)
router.post('/login', accountController.loginPost)
router.get('/register', accountController.register)
router.post('/register', accountController.registerPost)
router.get('/logout', accountController.logout)

module.exports = router
