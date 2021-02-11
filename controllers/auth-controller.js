const httpErrors = require('http-errors')
const User = require('../models/user-model')
const { generateAccessToken, generateRefreshToken, veriryRefreshToken } = require('../utils/jwt')
const { validateAuth } = require('../utils/validate-schema')

module.exports = {
    signUp: async (req, res, next) => {
        try {
            await validateAuth.validateAsync(req.body)

            const user = new User(req.body)

            const saveUser = await user.save()
                .catch(err => {
                    if (err.code === 11000) {
                        throw httpErrors.Conflict()
                    } else {
                        throw err
                    }
                })

            const payload = {
                aud: saveUser.id,
                role: saveUser.role
            }

            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) error.status = 400

            next(error)
        }
    },
    signIn: async (req, res, next) => {
        try {
            const result = await validateAuth.validateAsync(req.body)

            const user = await User.findOne({ username: result.username })

            if (!user) throw httpErrors.NotFound('User not registered')

            const isMatch = await user.isValidPassword(result.password)

            if (!isMatch) throw httpErrors.Unauthorized('Invalid Username or Password')

            const payload = {
                aud: user.id,
                role: user.role
            }

            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) return next(httpErrors.Unauthorized('Invalid Username or Password'))
            next(error)
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { token } = req.body
            if (!token) throw httpErrors.BadRequest()

            const payload = await veriryRefreshToken(token)

            const accessToken = await generateAccessToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            next(error)
        }
    }
}