const httpErrors = require('http-errors')
const User = require('../models/user-model')
const { generateAccessToken } = require('../utils/jwt')
const { authSchema } = require('../utils/validate-schema')

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)

            const user = new User(result)

            const saveUser = await user.save()
                .catch(err => {
                    if (err.code === 11000) {
                        throw httpErrors.Conflict()
                    } else {
                        throw err
                    }
                })

            const accessToken = await generateAccessToken({
                aud: saveUser.id,
                role: saveUser.role
            })

            res.send({ accessToken })
        } catch (error) {
            if (error.isJoi === true) error.status = 400

            next(error)
        }
    },
    signIn: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)

            const user = await User.findOne({ email: result.email })

            if (!user) throw httpErrors.NotFound('User not registered')

            const isMatch = await user.isValidPassword(result.password)

            if (!isMatch) throw httpErrors.Unauthorized('Invalid Username or Password')

            const accessToken = await generateAccessToken({
                aud: user.id,
                role: user.role
            })

            res.send({ accessToken })
        } catch (error) {
            if (error.isJoi === true) return next(httpErrors.Unauthorized('Invalid Username or Password'))
            next(error)
        }
    },
    refreshToken: async (req, res, next) => {
        res.send('REFRESH TOKEN')
    },
    signOut: async (req, res, next) => {
        res.send('SIGNOUT')
    }
}