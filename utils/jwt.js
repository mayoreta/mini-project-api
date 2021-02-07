const JWT = require('jsonwebtoken')

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
    }
}