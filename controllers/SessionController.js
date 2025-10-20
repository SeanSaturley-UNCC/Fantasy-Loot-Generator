const Session = require('../models/Session')
const { handleError } = require('../utils')
const { v4: uuid } = require('uuid')
const User = require('../models/User')


exports.findSession = async (req) => {
    const sessionId = req.signedCookies.User
    const foundSession = await Session.Session.findOne({
        token: sessionId,
        active: true
    })
    return foundSession
}

const getMaxAge = () => {
    return 24 * 60 * 60 * 1000
}

exports.createSession = async (res, userId) => {
    try {
        await exports.deleteAllSessions(userId)
        const newToken = uuid()
        const newSession = await Session.Session.create({
            userId: userId,
            active: true,
            token: newToken
        })
        res.clearCookie('User')
        res.cookie(
            'User',
            newToken,
            {
                httpOnly: true,
                secure: true,
                maxAge: getMaxAge(),
                signed: true
            }
        )
        return newSession
    } catch (err) {
        return
    }
}

exports.validateSession = async (req, res) => {
    try {
        const { userId } = req.params
        const sessionIsValid = await Session.Session.exists({
            userId: userId,
            active: true
        })
        res.status(200).json(sessionIsValid)
    } catch (err) {
        handleError(err, res)
    }
}

exports.deleteAllSessions = async (userId) => {
    try {
        await Session.Session.deleteMany({
            userId
        })
    } catch {}
}
