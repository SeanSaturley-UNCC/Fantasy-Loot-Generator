import * as Session from '../models/Session'
import { handleError } from '../handleError'
import { v4 as uuid } from 'uuid'
import { User } from '../models/User'

// TODO: add this if we want to
// import config from '../config'

// export const checkAPI = (req) => {
//     const {
//         API_HEADER,
//         API_KEY
//     } = config()

//     const key = req.get(API_HEADER)
//     if (!key || key !== API_KEY) {
//         return false
//     }
//     return true
// }

export const authenticate = async (req, res, next) => {
    try {
        if (!checkAPI(req)) {
            return res.status(401).end()
        }

        const userCookie = req.signedCookies.User
        const sessionExists = await Session.Session.findOne({
            token: userCookie,
            active: true
        })
        if (sessionExists) {
            const currentUser = await User.findOne({
                _id: sessionExists.userId
            }).lean()
            if (currentUser) {
                res.locals.user = currentUser
            }
            return next()
        }
        res.status(403).json({ message: 'This action is not allowed' })
    } catch {
        res.status(403).json({ message: 'Failed to Authenticate.' })
    }
}

export const findSession = async (req) => {
    const sessionId = req.signedCookies.User
    const foundSession = await Session.Session.findOne({
        token: sessionId,
        active: true
    })
    if (!foundSession) {
        // await deleteAllSessions()
    }
    return foundSession
}

const getMaxAge = () => {
    return 24 * 60 * 60 * 1000
}

export const createSession = async (res, userId) => {
    try {
        await deleteAllSessions(userId)
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

export const validateSession = async (req, res) => {
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

export const deleteAllSessions = async (userId) => {
    try {
        await Session.Session.deleteMany({
            userId
        })
    } catch {}
}
