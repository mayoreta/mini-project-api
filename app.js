const express = require('express')
const morgan = require('morgan')
const httpErrors = require('http-errors')
require('dotenv').config()
require('./utils/init-mongodb')
require('./utils/init-redis')
const { veriryAccessToken } = require('./utils/jwt')

const authRoute = require('./routes/auth-route')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', veriryAccessToken, (req, res, next) => {
    console.log(req.payload)
    res.send('Hello')
})

app.use('/auth', authRoute)

app.use(async (req, res, next) => {
    next(httpErrors.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server started, listen on port ${PORT}`)
})