import { Request, Response } from 'express'
import { handleError, hashPassword } from '../middleware/utils'
import User from '../Models/User'
import { Session } from '../Models/Session'
import { createSession, findSession } from './SessionController'

//* get one user by id
export const getOneUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const oneUser = await User.findOne({
            _id: id,
            deletedAt: {
                $exists: false
            }
        })
        if (!oneUser) {
            throw new Error('User not found')
        }
        res.status(200).json(oneUser)
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const deleteOne = async (req: Request, res: Response): Promise<void> => {
    try {
        await User.deleteOne({
            _id: req.params.id
        })
        res.status(200).end()
    } catch (err) {
        handleError(err as Error, res)
    }
}

//* login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body
        const foundUser = await User.findOne({
            $or: [
                { username: data.username }
            ]
        }).select(['+password'])

        if (!foundUser) {
            throw new Error('Invalid Username or Password')
        }        
        const check = await foundUser.comparePassword(data.password)
        if (!check) {
            throw new Error('Invalid Username or Password')
        }

        await createSession(res, (foundUser?._id?.toString()) ?? '')

        const userWithoutPassword = await User.findOne({
            _id: foundUser._id
        })
        res.status(200).json(userWithoutPassword)
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params
        const userExists = await User.exists({
            _id: userId
        })
        if (!userExists) {
            throw new Error('User not found')
        }
        await Session.deleteMany({
            userId
        })
        res.status(200).end()
    } catch (err) {
        handleError(err as Error, res)
    }
}

export const checkSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const existingSession = await findSession(req)        
        if (!existingSession) {
            res.status(400).json({ message: 'Session not found' })
            return
        }        
        const loggedInUser = await User.findOne({
            _id: existingSession.userId
        }).populate('inventory')

        res.status(200).json(loggedInUser)
    } catch (err) {
        handleError(err as Error, res)
    }
}

//* create user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body } = req

        const usernameExists = await User.exists({ username: body.username })
        if (usernameExists) {
            throw new Error('Username already exists')
        }

        const hashedPassword = await hashPassword(body.password)

        const createdUser = await User.create({
            username: body.username,
            password: hashedPassword
        })
        res.status(200).json(createdUser)
    } catch (err) {
        handleError(err as Error, res)
    }
}

//* get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .sort({ 'createdAt': -1 })

        res.status(200).json(users.reverse())
    } catch (err) {
        handleError(err as Error, res)
    }
}
