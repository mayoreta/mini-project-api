const httpErrors = require('http-errors')
const User = require('../models/user-model')

module.exports = {
    signUp: async (req, res, next) => {
        try {
            let { name, email, password, role } = req.body

            if (!email || !password) throw httpErrors.BadRequest()

            if (!name) name = 'default'

            if (!role) role = 2

            const user = new User({ name: name, email: email, password: password, role: role })

            const saveUser = await user.save()
                .catch(err => {
                    if (err.code === 11000) {
                        throw httpErrors.Conflict()
                    } else {
                        throw err
                    }
                })

            res.send(saveUser)
        } catch (error) {
            next(error)
        }
    },
    signIn: async (req, res, next) => {
        res.send('SIGNIN')
    },
    refreshToken: async (req, res, next) => {
        res.send('REFRESH TOKEN')
    },
    signOut: async (req, res, next) => {
        res.send('SIGNOUT')
    }
}