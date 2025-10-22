const { handleError, hashPassword } = require('../utils')
const User = require('../models/User')
const { createSession, findSession } = require('./SessionController')
const Session = require('../models/Session')

//* get one user by id
exports.getOneUser = async (req, res) => {
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
        handleError(err, res)
    }
}

exports.deleteOne = async (req, res) => {
    try {
        await User.deleteOne({
            _id: req.params.id
        })
        res.status(200).end()
    } catch (err) {
        handleError(err, res)
    }
}

//* login user
exports.loginUser = async (req, res) => {
    try {
        const data = req.body
        const foundUser = await User.findOne({
            $or: [
                { username: data.username },
                { email: data.email }
            ]
        }).select(['+password'])

        if (!foundUser) {
            throw new Error('Invalid Username or Password')
        }
        const check = await foundUser.comparePassword(data.password)
        if (!check) {
            throw new Error('Invalid Username or Password')
        }

        await createSession(res, foundUser._id)

        const userWithoutPassword = await User.findOne({
            _id: foundUser._id
        })
        res.status(200).json(userWithoutPassword)
    } catch (err) {
        handleError(err, res)
    }
}

exports.logoutUser = async (req, res) => {
    try {
        const { userId } = req.params
        const userExists = await User.exists({
            _id: userId
        })
        if (!userExists) {
            throw new Error('User not found')
        }
        await Session.Session.deleteMany({
            userId
        })
        res.status(200).end()
    } catch (err) {
        handleError(err, res)
    }
}

exports.checkSession = async (req, res) => {
    try {
        const existingSession = await findSession(req)
        if (!existingSession) {
            res.status(400).json({ message: 'Session not found' })
            return
        }
        const loggedInUser = await User.findOne({
            _id: existingSession.userId
        })
        res.status(200).json(loggedInUser)
    } catch (err) {
        handleError(err, res)
    }
}

//* create user
exports.createUser = async (req, res) => {
    try {
        const { body } = req

        const usernameExists = await User.exists({ username: body.username })
        if (usernameExists) {
            throw new Error('Username already exists')
            // return res.status(400).json({ message: 'Username already exists' })
        }
        const emailExists = await User.exists({ email: body.email })
        if (emailExists) {
            throw new Error('Email already exists')
            // return res.status(400).json({ message: 'Email already exists' })
        }

        const hashedPassword = await hashPassword(body.password)

        const createdUser = await User.create({
            username: body.username,
            email: body.email,
            password: hashedPassword
        })
        res.status(200).json(createdUser)
    } catch (err) {
        handleError(err, res)
    }
}

//* get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .sort({ 'createdAt': -1 })

        res.status(200).json(users.reverse())
    } catch (err) {
        handleError(err, res)
    }
}
