import { Request, Response } from 'express'
import { Session } from '../Models/Session'
import { handleError } from '../middleware/utils'
import { v4 as uuid } from 'uuid'

export const findSession = async (req: Request) => {
    const sessionId = req.signedCookies.User
    const foundSession = await Session.findOne({
        token: sessionId,
        active: true
    })
    return foundSession
}

const getMaxAge = (): number => {
    return 24 * 60 * 60 * 1000
}

export const createSession = async (res: Response, userId: string) => {
    try {
        await deleteAllSessions(userId)        
        const newToken = uuid()
        const newSession = await Session.create({
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

export const validateSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params
        const sessionIsValid = await Session.exists({
            userId: userId,
            active: true
        })
        res.status(200).json(sessionIsValid)
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const deleteAllSessions = async (userId: string): Promise<void> => {
    try {
        await Session.deleteMany({
            userId
        })
    } catch {}
}
