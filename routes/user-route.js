const express = require('express')
const { saveUser, getUser, readUser, updateUser, deleteUser } = require('../controllers/user-controller')
const router = express.Router()

router.post('/', saveUser)
router.get('/', readUser)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router