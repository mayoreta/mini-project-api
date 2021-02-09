const express = require('express')

const router = express.Router()

const { signUp, signIn, refreshToken } = require('../controllers/auth-controller')

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/refresh-token', refreshToken)

module.exports = router