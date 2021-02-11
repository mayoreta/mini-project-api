const AccessControl = require('accesscontrol')
const httpErrors = require('http-errors')
const { userRole, baseUrl } = require('./const')

const ac = new AccessControl()

ac.grant(userRole.BASIC)
    .readOwn(baseUrl.USER)
    .grant(userRole.ADMIN)
    .createAny(baseUrl.USER)
    .readAny(baseUrl.USER)
    .updateAny(baseUrl.USER)
    .deleteAny(baseUrl.USER)

const grantAccess = (req, res, next) => {
    try {
        console.log(req)
        const method = req.method
        const url = req.baseUrl
        const role = ac.can(req.payload.role)
        let permission

        if (method === 'GET') {
            console.log(req.params.id)
            console.log(req.payload.aud)
            permission = req.params.id === req.payload.aud ? role.readOwn(url) : role.readAny(url)
        } else if (method === 'POST') {
            permission = role.createAny(url)
        } else if (method === 'PATCH') {
            permission = req.params.id === req.payload.aud ? role.updateOwn(url) : role.updateAny(url)
        } else {
            permission = req.params.id === req.payload.aud ? role.deleteOwn(url) : role.deleteAny(url)
        }

        if (permission.granted) {
            next()
        } else {
            throw httpErrors.Unauthorized(`You don't have enough permission to perform this action`)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = grantAccess