const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { userRole } = require('../utils/const')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'user',
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: userRole.BASIC,
    }
})

const hashingPassword = async function (next) {
    try {
        let data = this._update
        
        if (!data) data = this

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        data.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
}

userSchema.pre('save', hashingPassword)

userSchema.pre('findOneAndUpdate', hashingPassword)

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

module.exports = mongoose.model('user', userSchema);