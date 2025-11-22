import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import { Session } from '../Models/Session'
import User from '../Models/User'

interface CustomError extends Error {
    statusCode?: number
}

export const handleError = async (err: CustomError, res: Response): Promise<void> => {
    const error = {
        errCode: err.statusCode ? err.statusCode : 500,
        message: err.message
    }

    res.status(error.errCode).json({ message: error.message })
}

export const hashPassword = async (oldValue: string): Promise<string> => {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const newValue = await bcrypt.hash(oldValue, salt)

    return newValue
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userCookie = req.signedCookies.User
        const sessionExists = await Session.findOne({
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
            next()
            return
        }
        res.status(403).json({ message: 'This action is not allowed' })
    } catch (err) {
        res.status(403).json({ message: 'Failed to Authenticate.' })
    }
}
