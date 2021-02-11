const express = require('express')
const { saveUser, getUser, readUser, updateUser, deleteUser } = require('../controllers/user-controller')
const router = express.Router()
const grantAccess = require('../utils/roles')

router.post('/', grantAccess, saveUser)
router.get('/', grantAccess, readUser)
router.get('/:id', grantAccess, getUser)
router.patch('/:id', grantAccess, updateUser)
router.delete('/:id', grantAccess, deleteUser)

module.exports = router