const JWT = require('jsonwebtoken')
const httpErrors = require('http-errors')
const client = require('./init-redis')

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
    },
    generateRefreshToken: (payload) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET
            const option = {
                expiresIn: '1y'
            }
            JWT.sign(payload, secret, option, (err, token) => {
                if (err) {
                    console.log(err.message)
                    return reject(httpErrors.InternalServerError())
                }

                client.SET(payload.aud, token, (err, reply) => {
                    if (err) {
                        console.log(err.message)
                        return reject(httpErrors.InternalServerError())
                    }

                    resolve(token)
                })
            })
        })
    },
    veriryRefreshToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) {
                    console.log(err.message)
                    return reject(httpErrors.InternalServerError())
                }

                client.GET(payload.aud, (err, value) => {
                    if (err) {
                        console.log(err.message)
                        return reject(httpErrors.InternalServerError())
                    }

                    if (value === token) return resolve({
                        aud: payload.aud,
                        role: payload.role,
                    })

                    reject(httpErrors.Unauthorized())
                })                
            })
        })
    }
}