const httpErrors = require('http-errors')
const User = require('../models/user-model')
const { validateCreateUser, validateUpdateUser } = require('../utils/validate-schema')

module.exports = {
    readUser: async (req, res, next) => {
        try {
            const user = await User.find({}, { __v: 0, password: 0 })

            res.send(user)
        } catch (error) {
            next(error)
        }
    },
    getUser: async (req, res, next) => {
        try {
            const id = req.params.id

            const user = await User.findById(id, { __v: 0, password: 0 })

            if (!user) throw httpErrors.NotFound('User not found')

            res.send(user)
        } catch (error) {
            next(error)
        }
    },
    saveUser: async (req, res, next) => {
        try {
            await validateCreateUser.validateAsync(req.body)

            const user = new User(req.body)

            const saveUser = await user.save()
                .catch(err => {
                    if (err.code === 11000) {
                        throw httpErrors.Conflict()
                    } else {
                        throw err
                    }
                })

            res.send({
                success: true,
                message: `User ${saveUser.name} has been created`
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 400

            next(error)
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const id = req.params.id

            await validateUpdateUser.validateAsync(req.body)

            const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true, })

            if (!updateUser) throw httpErrors.NotFound('User Not Found')

            res.send({
                success: true,
                message: `User ${id} has been updated`
            })
        } catch (error) {
            next(error)
        }
    },
    deleteUser: async (req, res, next) => {
        try {
            const id = req.params.id

            const result = await User.findByIdAndDelete(id, { __: 0, password: 0 })

            if (!result) throw httpErrors.NotFound('User not found')

            res.send({
                success: true,
                message: `Successful deleted user ${id}`
            })
        } catch (error) {
            next(error)
        }
    }
}