const JWT = require('jsonwebtoken')
const httpErrors = require('http-errors')

module.exports = {
    generateAccessToken: (payload) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.ACCESS_TOKEN_SECRET
            const option = {
                expiresIn: '1h'
            }
            JWT.sign(payload, secret, option, (err, token) => {
                if (err) return reject(err)

                resolve(token)
            })
        })
    },
    veriryAccessToken: (req, res, next) => {
        if (!req.headers.authorization) return next(httpErrors.Unauthorized())

        const authHeader = req.headers.authorization
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(httpErrors.Unauthorized(message))
            }

            req.payload = payload
            next()
        })
    }
}